import * as routing from "./routing.js";

export function setElementAttribute(
	node: Node,
	key: string,
	value: unknown,
): void {
	const node_unsafe = node as any;
	if (key === "class") {
		if (node instanceof HTMLElement) {
			const value_unsafe = value as string;
			node.className = value_unsafe;
		}
	} else if (key === "for") {
		if (node instanceof HTMLLabelElement) {
			node.htmlFor = `${value}`;
		}
	} else if (key === "href") {
		if (node instanceof HTMLAnchorElement) {
			const value_unsafe = value as string;
			node.href = value_unsafe;

			if (value_unsafe.startsWith("/")) {
				if (node_unsafe._click) {
					node.removeEventListener("click", node_unsafe._click);
				}
				const callback = (event: HTMLElementEventMap["click"]) => {
					event.preventDefault();
					routing.push(node.href);
				};
				node.addEventListener("click", callback);
				node_unsafe._click = callback;
			}
		}
	} else if (key === "value") {
		if (node instanceof HTMLInputElement) {
			if (node.type === "radio") {
				node.checked = !!value;
			}
		}
	} else if (key === "onchangevalue") {
		if (node instanceof HTMLInputElement) {
			if (node_unsafe._change) {
				node.removeEventListener("change", node_unsafe._change);
			}
			const callback = (event: HTMLElementEventMap["change"]) => {
				const value_unsafe = value as (value: unknown) => void;
				value_unsafe((event.target! as typeof node).checked);
			};
			node.addEventListener("change", callback);
			node_unsafe._change = callback;
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
