import type { Disposer } from "./disposer.js";
import type { $Element } from "./node.js";
import * as routing from "./routing.js";

export function setElementAttribute(
	element: $Element,
	key: string,
	value: unknown,
	attributes: Record<string, unknown>,
): void {
	if (value === undefined) {
		return;
	}

	if (key === "class" && element instanceof HTMLElement) {
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
	} else if (
		(key === "onchangevalue" || key === "oninputvalue") &&
		element instanceof HTMLInputElement
	) {
		const value_unsafe = value as (value: unknown) => void;
		const type_unsafe = attributes[
			"type"
		] as JSX.IntrinsicElements["input"]["type"];
		setEventListener(
			element,
			key === "oninputvalue" ? "input" : "change",
			(event: HTMLElementEventMap["change"]) => {
				value_unsafe(getEventValue(event, type_unsafe));
			},
		);
	} else if (key.startsWith("on")) {
		const type_unsafe = key.substring(2) as keyof HTMLElementEventMap;
		const value_unsafe = value as () => unknown;
		setEventListener(element, type_unsafe, value_unsafe);
	} else if (element instanceof HTMLElement) {
		const value_safe = `${value}`;
		element.setAttribute(key, value_safe);
	}
}

function setEventListener<TEvent extends keyof HTMLElementEventMap>(
	element: $Element,
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
function getEventValue(
	event: Event,
	type: JSX.IntrinsicElements["input"]["type"],
): unknown {
	const element = event.target as HTMLInputElement;
	if (type === "number" || type === "range") {
		const value = parseInt(element.value, 10);
		return !Number.isNaN(value) ? value : undefined;
	} else if (type === "checkbox" || type === "radio") {
		const value = element.checked;
		return typeof value === "boolean" ? value : undefined;
	} else if (type === "file") {
		const value = element.files;
		return value instanceof FileList ? value : undefined;
	} else {
		const value = element.value;
		return typeof value === "string" ? value : undefined;
	}
}
