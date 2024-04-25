import { reaction } from "./signal.js";
import type { Disposer } from "./disposer.js";
import { setElementAttribute } from "./set-element-attribute.js";

export function h<
	TTag extends keyof JSX.IntrinsicElements | ((...args: any[]) => any),
>(
	tag: TTag,
	attributes: TTag extends keyof JSX.IntrinsicElements
		? JSX.IntrinsicElements[TTag]
		: TTag extends (...args: any[]) => any
			? Parameters<TTag>[0] extends undefined
				? Record<string, never>
				: Parameters<TTag>[0]
			: Record<string, never>,
	...children: unknown[]
): TTag extends keyof JSX.IntrinsicElements
	? Element
	: TTag extends (...args: any[]) => any
		? ReturnType<TTag>
		: unknown {
	if (typeof tag === "string") {
		const node = document.createElement(tag);
		const nodeData = Object.assign(node, { _disposers: [] as Disposer[] });
		if (attributes) {
			for (const key in attributes) {
				const props_unsafe = attributes as Record<string, unknown>;
				const value = props_unsafe[key];
				if (typeof value === "function" && !key.startsWith("on")) {
					const value_unsafe = value as () => unknown;
					nodeData._disposers.push(
						reaction(
							() => value_unsafe(),
							(value) => setElementAttribute(node, key, value),
						),
					);
				} else {
					setElementAttribute(node, key, value);
				}
			}
		}
		walk(node, children, nodeData._disposers);
		return node as ReturnType<typeof h>;
	}
	if (tag === h.Fragment) {
		return children as ReturnType<typeof h>;
	}
	if (typeof tag === "function") {
		return tag({ ...attributes, children });
	}

	return undefined as ReturnType<typeof h>;
}

h.Fragment = function Fragment() {};

function walk(node: Node, value: unknown, disposers: Disposer[]): void {
	if (typeof value === "number") {
		node.appendChild(document.createTextNode(value.toString()));
	} else if (typeof value === "string") {
		node.appendChild(document.createTextNode(value));
	} else if (Array.isArray(value)) {
		value.forEach((value) => walk(node, value, disposers));
	} else if (value instanceof Node) {
		node.appendChild(value);
	} else if (typeof value === "function") {
		const slot = document.createElement("slot");
		slot.setAttribute(":type", "function");
		const value_unsafe = value as () => unknown;
		disposers.push(
			reaction(
				() => value_unsafe(),
				(value) => {
					Array.from(slot.childNodes).forEach(unmount);
					walk(slot, value, disposers);
				},
			),
		);
		node.appendChild(slot);
	} else if (value instanceof Promise) {
		const slot = document.createElement("slot");
		slot.setAttribute(":type", "promise");
		value.then((result: unknown) => {
			walk(slot, result, disposers);
		});
		node.appendChild(slot);
	} else if (
		value &&
		typeof value === "object" &&
		"default" in value &&
		typeof value.default === "function"
	) {
		walk(node, value.default(), disposers);
	}
}

export function mount(
	component: unknown,
	nodeOrId?: Node | string | undefined,
): Disposer {
	let node: Node;
	if (nodeOrId === undefined) {
		node = document.body;
	} else if (typeof nodeOrId === "string") {
		const nodeById = document.getElementById(nodeOrId);
		if (!nodeById) {
			throw new Error(`Could not find Node with id="${nodeOrId}".`);
		}
		node = nodeById;
	} else {
		node = nodeOrId;
	}
	const disposers: Disposer[] = [];
	const slot = document.createElement("slot");
	slot.setAttribute(":type", "root");
	walk(slot, h(h.Fragment, {}, component), disposers);
	node.appendChild(slot);
	return () => {
		Array.from(slot.childNodes).forEach(unmount);
		disposers.forEach((disposer) => disposer());
		node.removeChild(slot);
	};
}

function unmount(node: Node) {
	Array.from(node.childNodes).forEach(unmount);
	const nodeData = node as unknown as ElementData;
	nodeData._disposers?.forEach((disposer) => disposer());
	node.parentNode?.removeChild(node);
}
