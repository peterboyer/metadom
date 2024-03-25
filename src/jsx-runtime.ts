import { reaction } from "./atom";
import { isReactor, type Reactor } from "./reactor";

const events = ["onclick"] satisfies (keyof HTMLElement)[];
function isEventKey(key: string): key is (typeof events)[number] {
	return events.includes(key as any);
}

type _Element = Element;

declare global {
	module JSX {
		type IntrinsicElements = {
			[TagName in keyof HTMLElementTagNameMap]: {
				id?: string;
				class?: string;
				onclick?: NonNullable<HTMLElement["onclick"]>;
				[key: string]: unknown;
			};
		} & {
			input: {
				type: "radio";
				value: boolean | Reactor<boolean>;
				"value:change": (value: boolean) => unknown;
			};
		};

		type Element = {
			node: _Element;
		};
	}
}

type AnyProps = Record<string, unknown>;
type IntrinsicProps = JSX.IntrinsicElements[keyof JSX.IntrinsicElements];

export type Component = () => JSX.Element;

type JSXArgs = JSXArgs.Intrinsic | JSXArgs.Function;
namespace JSXArgs {
	export type Intrinsic = [
		tag: string,
		props: IntrinsicProps | null,
		...children: unknown[],
	];
	export type Function = [
		tag: (props: AnyProps) => JSX.Element,
		props: AnyProps | null,
		...children: unknown[],
	];
}

function setElementProp(element: Element, key: string, value: unknown): void {
	if (isEventKey(key)) {
		const type = key.substring(2);
		if (value) {
			element.addEventListener(type, value as any);
		}
	} else if (key === "for") {
		// @ts-ignore TODO: Fix this.
		element.htmlFor = value;
	} else if (key === "value") {
		if (element.type === "radio") {
			element.checked = value;
		}
	} else if (key === "value:change") {
		if (element.type === "radio") {
			element.removeEventListener("change", element.changeCb);
			element.changeCb = (e) => {
				console.log(e.target.id, e.target.value, e.target);
				value(e.target.value);
			};
			element.addEventListener("change", element.changeCb);
		}
	} else {
		// @ts-ignore TODO: Fix this.
		element[key] = value;
	}
}

export const jsx = (...args: JSXArgs): JSX.Element => {
	console.debug(args);
	let parent: Element;
	const [, , ...children] = args;
	if (typeof args[0] === "string") {
		const [tag, props] = args as JSXArgs.Intrinsic;
		parent = document.createElement(tag);
		if (props) {
			for (const key in props) {
				const value = props[key];
				if (isReactor(value)) {
					reaction(
						() => value.$(),
						(value) => setElementProp(parent, key, value),
					);
				} else {
					setElementProp(parent, key, value);
				}
			}
		}
	} else {
		const [tag, props] = args as JSXArgs.Function;
		parent = tag(props ?? {}).node;
	}

	children.forEach((child, index) => {
		if (child === undefined) {
			return;
		} else if (child === null) {
			return;
		} else if (typeof child === "boolean") {
			return;
		} else if (typeof child === "number") {
			parent.append(child.toString());
		} else if (typeof child === "string") {
			parent.append(child);
		} else if (
			typeof child === "object" &&
			"node" in child &&
			child.node instanceof Node
		) {
			parent.append(child.node);
		} else if (isReactor(child)) {
			reaction(
				() => child.$(),
				(value) => {
					const resultFormatted = format(value) ?? "";
					const currentNode = parent.childNodes[index];
					if (!currentNode) {
						parent.append(resultFormatted);
					} else if (resultFormatted) {
						currentNode.replaceWith(resultFormatted);
					} else {
						currentNode.remove();
					}
				},
			);
		}
	});

	return { node: parent };
};

function format(value: unknown): undefined | string | Node {
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
	} else if (
		typeof value === "object" &&
		"node" in value &&
		value.node instanceof Node
	) {
		return value.node;
	}
	return undefined;
}
