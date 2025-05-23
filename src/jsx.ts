import type { Disposer } from "./disposer.js";
import {
	assignDisposer,
	createSlot,
	insert,
	is$Element,
	type $Node,
} from "./node.js";
import { reaction } from "./signal.js";
import { setElementAttribute } from "./set-element-attribute.js";
import { Signal_fromPromise } from "./signal-from-promise.js";

export function h<TTag extends Tag>(
	tag: TTag,
	attributes: TagAttributes<TTag>,
	...children: TagChildren
): TagReturn<TTag> {
	if (typeof tag === "string") {
		const node: $Node = document.createElement(tag);
		if (attributes) {
			for (const key in attributes) {
				const props_unsafe = attributes as Record<string, unknown>;
				const value = props_unsafe[key];
				if (typeof value === "function" && !key.startsWith("on")) {
					const value_unsafe = value as () => unknown;
					const disposer = reaction(
						() => value_unsafe(),
						(value) => setElementAttribute(node, key, value, attributes),
					);
					assignDisposer(node, disposer);
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
		const props = { ...attributes, children };
		const disposers: Disposer[] = [];
		const value = tag(props) as ReturnType<typeof h>;

		let _children = value;

		if (value && typeof value === "object" && "next" in value) {
			const iterator = value as unknown as Iterator<unknown>;
			let result = iterator.next();
			while (!result.done) {
				const disposer = result.value as Disposer;
				disposers.push(disposer);
				result = iterator.next();
			}
			_children = result.value;
		}

		if (_children instanceof Promise) {
			// Something is leaking in here? Async is okay, but w/ Loader leaks.
			const value_safe = value as Promise<unknown>;
			const state = Signal_fromPromise(value_safe);
			const Pending =
				typeof tag.Pending === "function" ? tag.Pending : undefined;
			const Rejected =
				typeof tag.Rejected === "function" ? tag.Rejected : undefined;

			_children = () => {
				const stateValue = state();
				if (stateValue._type === "fulfilled") {
					// This?
					return stateValue.value;
				} else if (stateValue._type === "pending") {
					return Pending ? Pending(props) : undefined;
				} else if (stateValue._type === "rejected") {
					if (!Rejected) console.error(stateValue.error);
					return Rejected ? Rejected(props, stateValue.error) : undefined;
				}
				return undefined;
			};
		}

		if (typeof tag.Layout === "function") {
			_children = tag.Layout(props, _children);
		}

		return { _component: true, children: _children, disposers };
	}
	return undefined as TagReturn<TTag>;
}

h.Fragment = function Fragment() {};

function walk(node: $Node, value: unknown): void {
	if (typeof value === "number") {
		insert(node, document.createTextNode(value.toString(10)));
	} else if (typeof value === "string") {
		insert(node, document.createTextNode(value));
	} else if (Array.isArray(value)) {
		value.forEach((value) => walk(node, value));
	} else if (value instanceof Node) {
		insert(node, value);
	} else if (typeof value === "function") {
		const slot = createSlot();
		slot._type = "function";
		slot._source = value;
		insert(node, slot);
		const value_unsafe = value as () => unknown;
		assignDisposer(
			slot,
			reaction(
				() => value_unsafe(),
				(value) => {
					slot._children?.forEach(unmount);
					walk(slot, value);
				},
			),
		);
	} else if (value && typeof value == "object" && "_component" in value) {
		const slot = createSlot();
		slot._type = "component";
		slot._source = value;
		insert(node, slot);
		const value_unsafe = value as { children: unknown; disposers?: Disposer[] };
		walk(slot, value_unsafe.children);
		value_unsafe.disposers?.forEach((disposer) => {
			assignDisposer(slot, disposer);
		});
	} else if (value instanceof Promise) {
		// const slot = createSlot();
		// slot._type = "promise";
		// slot._source = value;
		// insert(node, slot);
		// const value_unsafe = value as Promise<unknown>;
		// value_unsafe.then((result) => walk(slot, result));
	} else if (value && typeof value === "object" && "default" in value) {
		// walk(node, value.default);
	}
}

export function mount(
	value: unknown,
	nodeOrId?: Node | string | undefined,
): Disposer {
	let node: $Node;
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
	console.debug("root:mount", { node, value });
	walk(node, value);
	return () => {
		console.debug("root:unmount", { node, value });
		node._children?.forEach(unmount);
		node._disposers?.forEach((disposer) => disposer());
		node._disposersKeyed?.forEach((disposer) => disposer());
	};
}

function unmount(node: $Node) {
	node._disposers?.forEach((disposer) => disposer());
	node._disposers = undefined;
	node._disposersKeyed?.forEach((disposer) => disposer());
	node._disposersKeyed = undefined;
	node._children?.forEach(unmount);
	node._children = undefined;
	node._parent?._children?.delete(node);
	if (is$Element(node) && node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

export function assignLayout<TComponent extends (...args: any[]) => any>(
	component: TComponent,
	callback: (props: Parameters<TComponent>[0], children: unknown) => unknown,
): void {
	Object.assign(component, { Layout: callback });
}

export function assignAsyncPending<TComponent extends (...args: any[]) => any>(
	component: TComponent,
	callback: (props: Parameters<TComponent>[0]) => unknown,
): void {
	Object.assign(component, { Pending: callback });
}

export function assignAsyncRejected<TComponent extends (...args: any[]) => any>(
	component: TComponent,
	callback: (props: Parameters<TComponent>[0], error: unknown) => unknown,
): void {
	Object.assign(component, { Rejected: callback });
}

type Tag =
	| keyof JSX.IntrinsicElements
	| (((...args: any[]) => unknown) & {
			Layout?: unknown;
			Pending?: unknown;
			Rejected?: unknown;
	  });

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
