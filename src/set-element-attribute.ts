import type { Disposer } from "./disposer.js";
import type { ElementExtended } from "./node.js";
import * as routing from "./routing.js";

export function setElementAttribute(
	element: ElementExtended,
	key: string,
	value: unknown,
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
		// TODO, default to string for unhandled
		// TODO, onchangevalue support for all other inputs
		const value_unsafe = value as (value: unknown) => void;
		setEventListener(
			element,
			"change",
			(event: HTMLElementEventMap["change"]) => {
				value_unsafe((event.target! as typeof element).checked);
			},
		);
	} else if (key.startsWith("on")) {
		const type_unsafe = key.substring(2) as keyof HTMLElementEventMap;
		const value_unsafe = value as () => unknown;
		setEventListener(element, type_unsafe, value_unsafe);
	} else {
		(element as any)[key] = value;
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
