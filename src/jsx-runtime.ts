import { reaction } from "./atom";

const events = ["onclick"] satisfies (keyof HTMLElement)[];
function isEventKey(key: string): key is (typeof events)[number] {
	return events.includes(key as any);
}

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
			input: {
				type: "radio";
				name: string;
				value?: boolean;
				"value:change"?: (value: boolean) => unknown;
			};
		};
	}
}

type AnyProps = Record<string, unknown>;
type IntrinsicProps = JSX.IntrinsicElements[keyof JSX.IntrinsicElements];

export type Component = () => Element;

type JSXArgs = JSXArgs.Intrinsic | JSXArgs.Function;
namespace JSXArgs {
	export type Intrinsic = [
		tag: string,
		props: IntrinsicProps | null,
		...children: unknown[],
	];
	export type Function = [
		tag: (props: AnyProps) => Element,
		props: AnyProps | null,
		...children: unknown[],
	];
}

type ElementData = { change?: (...args: any[]) => void };
const Elements = new Map<Element, ElementData>();
function getElementData(element: Element): ElementData {
	let data = Elements.get(element);
	if (!data) Elements.set(element, (data = {}));
	return data;
}

function setElementProp(element: Element, key: string, value: unknown): void {
	if (isEventKey(key)) {
		const type = key.substring(2);
		if (value) {
			element.addEventListener(type, value as any);
		}
	} else if (key === "for") {
		if (element instanceof HTMLLabelElement) {
			element.htmlFor = `${value}`;
		}
	} else if (key === "value") {
		if (element instanceof HTMLInputElement) {
			if (element.type === "radio") {
				element.checked = !!value;
			}
		}
	} else if (key === "value:change") {
		if (element instanceof HTMLInputElement) {
			const data = getElementData(element);
			if (data.change) {
				element.removeEventListener("change", data.change);
			}
			const callback = (event: HTMLElementEventMap["change"]) => {
				const value_unsafe = value as (value: unknown) => void;
				value_unsafe((event.target! as typeof element).checked);
			};
			element.addEventListener("change", callback);
			data.change = callback;
		}
	} else {
		(element as any)[key] = value;
	}
}

export const jsx = (...args: JSXArgs): Element => {
	console.debug(args);
	let element: Element;
	const [, , ...children] = args;
	if (typeof args[0] === "string") {
		const [tag, props] = args as JSXArgs.Intrinsic;
		element = document.createElement(tag);
		if (props) {
			for (const key in props) {
				const value = props[key];
				if (key.endsWith("$")) {
					const keyReal = key.substring(0, key.length - 1);
					const value_unsafe = value as () => void;
					const _disposer = reaction(
						() => value_unsafe(),
						(value) => setElementProp(element, keyReal, value),
					);
				} else {
					setElementProp(element, key, value);
				}
			}
		}
	} else {
		const [tag, props] = args as JSXArgs.Function;
		element = tag(props ?? {});
	}

	children.forEach((child, index) => {
		if (child === undefined) {
			return;
		} else if (child === null) {
			return;
		} else if (typeof child === "boolean") {
			return;
		} else if (typeof child === "number") {
			element.append(child.toString());
		} else if (typeof child === "string") {
			element.append(child);
		} else if (child instanceof Element) {
			element.append(child);
		} else if (typeof child === "function") {
			const _disposer = reaction(
				() => child() as unknown,
				(value) => {
					const resultFormatted = format(value) ?? "";
					const currentNode = element.childNodes[index];
					if (!currentNode) {
						element.append(resultFormatted);
					} else if (resultFormatted) {
						currentNode.replaceWith(resultFormatted);
					} else {
						// _disposer()
						currentNode.remove();
					}
				},
			);
		}
	});

	return element;
};

function format(value: unknown): undefined | string | Element {
	if (value === undefined) {
		return undefined;
	} else if (value === null) {
		return undefined;
	} else if (typeof value === "boolean") {
		return undefined;
	} else if (typeof value === "number") {
		return value.toString();
	} else if (typeof value === "string") {
		return value;
	} else if (value instanceof Element) {
		return value;
	}
	return undefined;
}
