import type { Disposer } from "./disposer.js";
import type { ElementExtended } from "./node.js";
import * as routing from "./routing.js";

export function setElementAttribute(
	element: ElementExtended,
	key: string,
	value: unknown,
	attributes: Record<string, unknown>,
): void {
	if (key === "class") {
		const value_unsafe = value as string;
		element.className = value_unsafe;
	} else if (key === "for" && element instanceof HTMLLabelElement) {
		const value_unsafe = value as string;
		element.htmlFor = value_unsafe;
	} else if (key === "href" && element instanceof HTMLAnchorElement) {
		const value_unsafe = value as string;
		element.href = value_unsafe;
		if (value_unsafe.startsWith("/")) {
			setEventListener(
				element,
				"click",
				(event: HTMLElementEventMap["click"]) => {
					event.preventDefault();
					routing.push(element.href);
				},
			);
		}
	} else if (key === "value" && element instanceof HTMLInputElement) {
		if (element.type === "radio") {
			element.checked = !!value;
		}
	} else if (key === "onchangevalue" && element instanceof HTMLInputElement) {
		const value_unsafe = value as (value: unknown) => void;
		const type_unsafe = attributes[
			"type"
		] as JSX.IntrinsicElements["input"]["type"];
		if (type_unsafe === "number" || type_unsafe === "range") {
			setEventListener(
				element,
				"input",
				(event: HTMLElementEventMap["change"]) => {
					value_unsafe(parseInt((event.target as typeof element).value, 10));
				},
			);
		} else if (type_unsafe === "checkbox" || type_unsafe === "radio") {
			setEventListener(
				element,
				"input",
				(event: HTMLElementEventMap["change"]) => {
					value_unsafe((event.target as typeof element).checked);
				},
			);
		} else if (type_unsafe === "file") {
			setEventListener(
				element,
				"input",
				(event: HTMLElementEventMap["change"]) => {
					value_unsafe((event.target as typeof element).files);
				},
			);
		} else {
			setEventListener(
				element,
				"input",
				(event: HTMLElementEventMap["change"]) => {
					value_unsafe((event.target as typeof element).value);
				},
			);
		}
	} else if (key.startsWith("on")) {
		const type_unsafe = key.substring(2) as keyof HTMLElementEventMap;
		const value_unsafe = value as () => unknown;
		setEventListener(element, type_unsafe, value_unsafe);
	} else {
		const element_unsafe = element as any;
		element_unsafe[key] = value;
	}
}

function setEventListener<TEvent extends keyof HTMLElementEventMap>(
	element: ElementExtended,
	event: TEvent,
	callback: (this: Element, event: HTMLElementEventMap[TEvent]) => void,
): void {
	{
		const disposer = element._disposersKeyed?.get(event);
		if (disposer) {
			disposer();
			element._disposersKeyed?.delete(event);
		}
	}

	element.addEventListener(event, callback as any);
	const disposer: Disposer = () => {
		element.removeEventListener(event, callback as any);
	};

	element._disposersKeyed = (element._disposersKeyed ?? new Map()).set(
		event,
		disposer,
	);
}
