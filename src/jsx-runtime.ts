import { reaction } from "./atom";

const events = ["onclick"] satisfies (keyof HTMLElement)[];
function isEventKey(key: string): key is (typeof events)[number] {
	return events.includes(key as any);
}

type ReactiveProps<T extends Record<string, unknown>> = {
	[Key in keyof T]: T[Key] | (() => Required<T>[Key]);
};

declare global {
	module JSX {
		type IntrinsicElements = {
			[TagName in keyof HTMLElementTagNameMap]: {
				id?: string;
				class?: string;
				onclick?: NonNullable<HTMLElement["onclick"]>;
			};
		} & {
			label: {
				for: string;
			};
			input: ReactiveProps<{
				type: "radio";
				name: string;
				value?: boolean;
			}> & {
				onchangevalue?: (value: boolean) => unknown;
			};
		};

		type Element = Node;
		type Component = () => JSX.Element;
	}
}

type AnyProps = Record<string, unknown>;
type IntrinsicProps = JSX.IntrinsicElements[keyof JSX.IntrinsicElements];

type JSXArgs = JSXArgs.Intrinsic | JSXArgs.Function;
namespace JSXArgs {
	export type Intrinsic = [
		tag: string,
		props: IntrinsicProps | null,
		...children: unknown[],
	];
	export type Function = [
		tag: (props: AnyProps) => Node,
		props: AnyProps | null,
		...children: unknown[],
	];
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

function setNodeProp(node: Node, key: string, value: unknown): void {
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
	} else if (isEventKey(key)) {
		const type = key.substring(2);
		if (value) {
			node.addEventListener(type, value as any);
		}
	} else {
		(node as any)[key] = value;
	}
}

function unmount(node: Node) {
	const data = getNodeData(node);
	Nodes.delete(node);

	data.disposers.forEach((disposer) => disposer());
	for (const child of node.childNodes) {
		unmount(child);
	}
}

export const jsx = (...args: JSXArgs): Node => {
	let node: Node;
	const disposers = new Set<() => void>();
	const [, , ...children] = args;
	if (typeof args[0] === "string") {
		const [tag, props] = args as JSXArgs.Intrinsic;
		node = document.createElement(tag);
		if (props) {
			for (const key in props) {
				const props_unsafe = props as Record<string, unknown>;
				const value = props_unsafe[key];
				if (typeof value === "function" && !key.startsWith("on")) {
					const value_unsafe = value as () => void;
					disposers.add(
						reaction(
							() => value_unsafe(),
							(value) => setNodeProp(node, key, value),
						),
					);
				} else {
					setNodeProp(node, key, value);
				}
			}
		}
	} else {
		const [tag, props] = args as JSXArgs.Function;
		node = tag(props ?? {});
	}

	children.forEach((child, index) => {
		if (child === undefined) {
			return;
		} else if (child === null) {
			return;
		} else if (typeof child === "boolean") {
			return;
		} else if (typeof child === "number") {
			node.appendChild(document.createTextNode(child.toString()));
		} else if (typeof child === "string") {
			node.appendChild(document.createTextNode(child));
		} else if (child instanceof Node) {
			node.appendChild(child);
		} else if (typeof child === "function") {
			disposers.add(
				reaction(
					() => child() as unknown,
					(value) => {
						const resultFormatted =
							format(value) ?? document.createTextNode("");
						const currentNode = node.childNodes[index];
						if (!currentNode) {
							node.appendChild(resultFormatted);
						} else if (resultFormatted) {
							currentNode.replaceWith(resultFormatted);
						} else {
							unmount(currentNode);
							currentNode.remove();
						}
					},
				),
			);
		}
	});

	const data = getNodeData(node);
	disposers.forEach((disposer) => data.disposers.add(disposer));

	return node;
};

function format(value: unknown): undefined | Node {
	if (value === undefined) {
		return undefined;
	} else if (value === null) {
		return undefined;
	} else if (typeof value === "boolean") {
		return undefined;
	} else if (typeof value === "number") {
		return document.createTextNode(value.toString());
	} else if (typeof value === "string") {
		return document.createTextNode(value);
	} else if (value instanceof Node) {
		return value;
	}
	return undefined;
}
