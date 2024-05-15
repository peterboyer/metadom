import type { Disposer } from "./disposer.js";

type MetaAttributes = {
	_parent?: $Node;
	_children?: Set<$Node>;
	_disposers?: Set<Disposer>;
	_disposersKeyed?: Map<string, Disposer>;
};

export class Slot {
	_type?: string;
	_source?: unknown;
}

export type $Slot = Slot & MetaAttributes;
export type $Element = Node & MetaAttributes;
export type $Node = $Element | $Slot;

export function createSlot(): $Slot {
	return new Slot();
}

export function is$Element(value: unknown): value is $Element {
	return value instanceof Node;
}

export function is$Slot(value: unknown): value is $Slot {
	return value instanceof Slot;
}

export function insert(parent: $Node, node: $Node): void {
	node._parent = parent;
	if (is$Element(parent)) {
		if (is$Element(node)) {
			parent.appendChild(node);
		}
		assignChild(parent, node);
	} else if (is$Slot(parent)) {
		if (is$Element(node)) {
			const dom_parent = getParent$Element(parent);
			if (!dom_parent) {
				return;
			}

			const result: {
				foundSelf: boolean;
				prev$Element?: $Element;
				next$Element?: $Element;
			} = { foundSelf: false };

			function walk(node: $Node): void {
				if (!node._children) {
					return;
				}

				for (const child of node._children) {
					if (child === parent) {
						result.foundSelf = true;
					} else if (is$Element(child)) {
						if (!result.foundSelf) {
							result.prev$Element = child;
						}
						if (result.foundSelf && !result.next$Element) {
							result.next$Element = child;
							return;
						}
					}

					if (is$Slot(child)) {
						walk(child);
					}
				}
			}

			walk(dom_parent);

			if (!result.next$Element) {
				dom_parent.appendChild(node);
			} else {
				result.next$Element.parentNode?.insertBefore(node, result.next$Element);
			}
		}
		assignChild(parent, node);
	}
}

function getParent$Element(node: $Node): $Element | undefined {
	const parent = node._parent;

	if (is$Element(parent)) {
		return parent;
	}

	if (is$Slot(parent)) {
		return getParent$Element(parent);
	}

	return undefined;
}

export function assignDisposer(node: $Node, disposer: Disposer): void {
	node._disposers = (node._disposers ?? new Set()).add(disposer);
}

export function assignChild(node: $Node, child: $Node): void {
	node._children = node._children ?? new Set();
	node._children.add(child);
}

const empty: Set<any> = new Set();
export function getChildren(node: $Node): Set<$Node> {
	return node._children ?? empty;
}
