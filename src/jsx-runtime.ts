export type { h } from "./jsx.js";

export namespace JSX {
	export type Element = globalThis.Element | Promise<unknown>;
	export type ElementClass = never;
	export type IntrinsicElements = Record<
		keyof HTMLElementTagNameMap,
		{
			id?: string;
			role?: string;
			class?: Reactive<string> | undefined;
			style?: Reactive<string> | undefined;
		} & {
			[EventType in keyof HTMLElementEventMap as `on${EventType}`]?:
				| ((event: HTMLElementEventMap[EventType]) => void)
				| undefined;
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
			for?: string | undefined;
		};
		input: {
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
	};
}

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
