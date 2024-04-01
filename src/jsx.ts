import { reaction } from "./signal";
import type { Disposer } from "./disposer";

type IntrinsicElementTag = string;
type ValueElementTag = (
	attributes?: Record<string, unknown>,
) => Element | unknown[] | undefined;

export function jsx(
	tag: IntrinsicElementTag | ValueElementTag,
	attributes: Record<string, unknown>,
	...children: unknown[]
): Element | unknown[] | undefined {
	if (typeof tag === "string") {
		const { element, disposers } = createElement(tag, attributes, children);
		const data = getNodeData(element);
		disposers.forEach((disposer) => data.disposers.add(disposer));
		return element;
	}
	if (tag === jsx.Fragment) {
		return children;
	}
	if (typeof tag === "function") {
		return tag({ ...attributes, children });
	}

	return undefined;
}

jsx.Fragment = function Fragment() {};

function createElement(
	tag: string,
	attributes: Record<string, unknown>,
	children: unknown[],
): {
	element: Element;
	disposers: Disposer[];
} {
	const element = document.createElement(tag);
	const disposers: Disposer[] = [];
	if (attributes) {
		for (const key in attributes) {
			const props_unsafe = attributes as Record<string, unknown>;
			const value = props_unsafe[key];
			if (typeof value === "function" && !key.startsWith("on")) {
				const value_unsafe = value as () => unknown;
				disposers.push(
					reaction(
						() => value_unsafe(),
						(value) => setElementAttribute(element, key, value),
					),
				);
			} else {
				setElementAttribute(element, key, value);
			}
		}
	}
	walk(element, children, disposers);
	return { element, disposers };
}

function walk(
	node: Node,
	value: unknown,
	disposers: Disposer[] = [],
): Disposer[] {
	if (typeof value === "number") {
		node.appendChild(document.createTextNode(value.toString()));
	} else if (typeof value === "string") {
		node.appendChild(document.createTextNode(value));
	} else if (Array.isArray(value)) {
		value.forEach((value) => walk(node, value, disposers));
	} else if (value instanceof Node) {
		node.appendChild(value);
	} else if (typeof value === "function") {
		const fragmentNodes = new Set<Node>();
		const value_unsafe = value as () => unknown;
		disposers.push(
			reaction(
				() => value_unsafe(),
				(value) => {
					fragmentNodes.forEach((fragmentNode) =>
						node.removeChild(fragmentNode),
					);
					fragmentNodes.clear();
					const fragment = new DocumentFragment();
					walk(fragment, value, disposers);
					fragment.childNodes.forEach((childNode) =>
						fragmentNodes.add(childNode),
					);
					node.appendChild(fragment);
				},
			),
		);
	}
	return disposers;
}

type NodeData = {
	change?: (...args: any[]) => void;
	disposers: Set<() => void>;
};

const Nodes = new Map<Node, NodeData>();
function getNodeData(node: Node): NodeData {
	let data = Nodes.get(node);
	if (!data) Nodes.set(node, (data = { disposers: new Set() }));
	return data;
}

function setElementAttribute(node: Node, key: string, value: unknown): void {
	if (key === "for") {
		if (node instanceof HTMLLabelElement) {
			node.htmlFor = `${value}`;
		}
	} else if (key === "value") {
		if (node instanceof HTMLInputElement) {
			if (node.type === "radio") {
				node.checked = !!value;
			}
		}
	} else if (key === "onchangevalue") {
		if (node instanceof HTMLInputElement) {
			const data = getNodeData(node);
			if (data.change) {
				node.removeEventListener("change", data.change);
			}
			const callback = (event: HTMLElementEventMap["change"]) => {
				const value_unsafe = value as (value: unknown) => void;
				value_unsafe((event.target! as typeof node).checked);
			};
			node.addEventListener("change", callback);
			data.change = callback;
		}
	} else if (key.startsWith("on")) {
		const type = key.substring(2);
		if (value) {
			const value_unsafe = value as () => unknown;
			node.addEventListener(type, value_unsafe);
		}
	} else {
		(node as any)[key] = value;
	}
}

export function mount(element: Element, component: unknown): Node {
	walk(element, component);
	document.body.append(element);
	return element;
}

export function unmount(node: Node) {
	const data = getNodeData(node);
	Nodes.delete(node);
	data.disposers.forEach((disposer) => disposer());
	for (const child of node.childNodes) {
		unmount(child);
	}
}
