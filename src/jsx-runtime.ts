export type { jsx } from "./jsx.js";

export namespace JSX {
	export type Element = globalThis.Element;
	export type ElementClass = never;
	export type IntrinsicElements = Record<
		keyof HTMLElementTagNameMap,
		{
			id?: string;
			role?: string;
			class?: Reactive<string>;
		} & {
			[EventType in keyof HTMLElementEventMap as `on${EventType}`]?: (
				event: HTMLElementEventMap[EventType],
			) => void;
		}
	> & {
		a: {
			href: Recommended<Reactive<string>>;
		};
		img: {
			src: Recommended<Reactive<string>>;
			alt: Recommended<Reactive<string>>;
		};
		label: {
			for: Recommended<string>;
		};
		input: {
			name: Recommended<string>;
		} & (
			| InputVariant<"button", never>
			| InputVariant<"checkbox", boolean>
			| InputVariant<"color", string>
			| InputVariant<"date", string>
			| InputVariant<"datetime-local", string>
			| InputVariant<"email", string>
			| InputVariant<"file", globalThis.File>
			| InputVariant<"hidden", unknown>
			| InputVariant<"image", string>
			| InputVariant<"month", number>
			| InputVariant<"number", number>
			| InputVariant<"password", string>
			| InputVariant<"radio", boolean>
			| InputVariant<"range", number>
			| InputVariant<"reset", never>
			| InputVariant<"search", string>
			| InputVariant<"submit", never>
			| InputVariant<"tel", string>
			| InputVariant<"time", string>
			| InputVariant<"url", string>
			| InputVariant<"week", number>
		);
	};
}

type InputVariant<TType extends string, TValue> = {
	type: TType;
	value: Recommended<Reactive<TValue>>;
	onchangevalue: Recommended<(value: TValue) => void>;
};

/**
 * Allow a property to be passed a function for a signal-driven value.
 */
export type Reactive<T> = T | (() => T);

/**
 * Require an explicit `undefined` value to opt-out of an optional property.
 */
export type Recommended<T> = undefined | T;
