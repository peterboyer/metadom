export type { h } from "./jsx.js";

export namespace JSX {
	export type Element = {};
	export type ElementClass = never;
	export type IntrinsicElements = Record<
		keyof HTMLElementTagNameMap,
		ElementAttributes
	> & {
		a: ElementAttributes_a;
		img: ElementAttributes_img;
		label: ElementAttributes_label;
		input: ElementAttributes_input;
	};

	type ElementAttributes_a = {
		href: Recommended<Reactive<string>>;
	};
	type ElementAttributes_img = {
		src: Recommended<Reactive<string>>;
		alt: Recommended<Reactive<string>>;
	};

	type ElementAttributes_label = {
		for?: string | undefined;
	};

	type ElementAttributes_input = {
		name: Recommended<string>;
	} & (
		| InputVariant<"color", string>
		| InputVariant<"date", string>
		| InputVariant<"datetime-local", string>
		| InputVariant<"email", string>
		| InputVariant<"hidden", string>
		| InputVariant<"month", string>
		| InputVariant<"password", string>
		| InputVariant<"search", string>
		| InputVariant<"tel", string>
		| InputVariant<"text", string>
		| InputVariant<"time", string>
		| InputVariant<"url", string>
		| InputVariant<"week", string>
		// use .value as number
		| InputVariant<"number", number>
		| (InputVariant<"range", number> & {
				min: number;
				max: number;
				step?: number | undefined;
		  })
		// use .checked
		| InputVariant<"checkbox", boolean>
		| InputVariant<"radio", boolean>
		// use .files
		| InputVariant<"file", FileList>
		// never
		| InputVariant<"image", never>
		| InputVariant<"button", never>
		| InputVariant<"submit", never>
		| InputVariant<"reset", never>
	);
}

interface ElementAttributes
	extends ElementBaseAttributes,
		ElementEventAttributes {}

type ElementBaseAttributes = {
	id?: string;
	role?: string;
	class?: Reactive<string> | undefined;
	style?: Reactive<string> | undefined;
};

type ElementEventAttributes = {
	[EventType in keyof HTMLElementEventMap as `on${EventType}`]?:
		| ((event: HTMLElementEventMap[EventType]) => void)
		| undefined;
};

type InputVariant<TType extends string, TValue> = {
	type: TType;
	value?: Reactive<TValue> | undefined;
	oninputvalue?: ((value: TValue) => void) | undefined;
	onchangevalue?: ((value: TValue) => void) | undefined;
};

/**
 * Allow a property to be passed a function for a signal-driven value.
 */
type Reactive<T> = T | (() => T);

/**
 * Require an explicit `undefined` value to opt-out of an optional property.
 */
type Recommended<T> = undefined | T;
