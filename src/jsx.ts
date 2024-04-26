import type { Disposer } from "./disposer.js";
import type { NodeExtended, ElementExtended } from "./node.js";
import { reaction } from "./signal.js";
import { setElementAttribute } from "./set-element-attribute.js";
import { Signal_fromPromise } from "./signal-from-promise.js";

export function h<TTag extends Tag>(
	tag: TTag,
	attributes: TagAttributes<TTag>,
	...children: TagChildren
): TagReturn<TTag> {
	if (typeof tag === "string") {
		const node = Object.assign(document.createElement(tag), {
			_disposers: new Set<Disposer>(),
		}) satisfies ElementExtended;
		if (attributes) {
			for (const key in attributes) {
				const props_unsafe = attributes as Record<string, unknown>;
				const value = props_unsafe[key];
				if (typeof value === "function" && !key.startsWith("on")) {
					const value_unsafe = value as () => unknown;
					node._disposers.add(
						reaction(
							() => value_unsafe(),
							(value) => setElementAttribute(node, key, value, attributes),
						),
					);
				} else {
					setElementAttribute(node, key, value, attributes);
				}
			}
		}
		walk(node, children);
		return node as TagReturn<TTag>;
	}
	if (tag === h.Fragment) {
		return children as TagReturn<TTag>;
	}
	if (typeof tag === "function") {
		const value = tag({ ...attributes, children }) as ReturnType<typeof h>;
		if (value instanceof Promise) {
			const value_safe = value as Promise<unknown>;
			const signal = Signal_fromPromise(value_safe);
			const wrapper = () => {
				const state = signal();
				if (state._type === "fulfilled") {
					return state.value;
				} else if (state._type === "pending") {
					if (typeof tag.Pending === "function") {
						return tag.Pending();
					}
					return undefined;
				} else if (state._type === "rejected") {
					if (typeof tag.Rejected === "function") {
						return tag.Rejected();
					}
					console.error(state.error);
					return undefined;
				}
				return undefined;
			};
			return wrapper as TagReturn<TTag>;
		}
		return value as TagReturn<TTag>;
	}
	return undefined as TagReturn<TTag>;
}

h.Fragment = function Fragment() {};

function walk(node: Node, value: unknown): void {
	if (typeof value === "number") {
		node.appendChild(document.createTextNode(value.toString()));
	} else if (typeof value === "string") {
		node.appendChild(document.createTextNode(value));
	} else if (Array.isArray(value)) {
		value.forEach((value) => walk(node, value));
	} else if (value instanceof Node) {
		node.appendChild(value);
	} else if (typeof value === "function") {
		const slot = Object.assign(document.createElement("slot"), {
			_disposers: new Set<Disposer>(),
		}) satisfies ElementExtended;
		slot.setAttribute(":type", "function");
		node.appendChild(slot);
		const value_unsafe = value as () => unknown;
		slot._disposers.add(
			reaction(
				() => value_unsafe(),
				(value) => {
					Array.from(slot.childNodes).forEach(unmount);
					walk(slot, value);
				},
			),
		);
	} else if (value instanceof Promise) {
		const value_unsafe = value as Promise<unknown>;
		const slot = document.createElement("slot");
		slot.setAttribute(":type", "promise");
		node.appendChild(slot);
		value_unsafe.then((result) => walk(slot, result));
	} else if (
		value &&
		typeof value === "object" &&
		"default" in value &&
		typeof value.default === "function"
	) {
		walk(node, value.default());
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
	const slot = Object.assign(document.createElement("slot"), {
		_disposers: new Set<Disposer>(),
	}) satisfies ElementExtended;
	slot.setAttribute(":type", "root");
	walk(slot, component);
	node.appendChild(slot);
	return () => {
		Array.from(slot.childNodes).forEach(unmount);
		slot._disposers.forEach((disposer) => disposer());
		node.removeChild(slot);
	};
}

function unmount(node: NodeExtended) {
	Array.from(node.childNodes).forEach(unmount);
	node._disposers?.forEach((disposer) => disposer());
	node._disposersKeyed?.forEach((disposer) => disposer());
	node.parentNode?.removeChild(node);
}

type Tag =
	| keyof JSX.IntrinsicElements
	| (((...args: any[]) => unknown) & { Pending?: unknown; Rejected?: unknown });

type TagAttributes<TTag> = TTag extends keyof JSX.IntrinsicElements
	? JSX.IntrinsicElements[TTag]
	: TTag extends (...args: any[]) => any
		? Parameters<TTag>[0] extends undefined
			? Record<string, never>
			: Parameters<TTag>[0]
		: Record<string, never>;

type TagChildren = unknown[];

type TagReturn<TTag> = TTag extends keyof JSX.IntrinsicElements
	? Element
	: TTag extends (...args: any[]) => any
		? ReturnType<TTag>
		: unknown;
