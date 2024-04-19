export type { jsx } from "./jsx.js";

export namespace JSX {
	export type Element = globalThis.Element;
	export type ElementClass = never;
	export type IntrinsicElements = {
		div: Attributes;
		span: Attributes;
		main: Attributes;
		dl: Attributes;
		dt: Attributes;
		dd: Attributes;
		pre: Attributes;
		h1: Attributes;
		ul: Attributes;
		li: Attributes;
		a: AnchorAttributes;
		p: Attributes;
		nav: Attributes;
		img: ImageAttributes;
		footer: Attributes;
		sup: Attributes;
		button: Attributes;
		fieldset: Attributes;
		legend: Attributes;
		label: LabelAttributes;
		input:
			| InputAttributes<"button", never>
			| InputAttributes<"checkbox", boolean>
			| InputAttributes<"color", string>
			| InputAttributes<"date", string>
			| InputAttributes<"datetime-local", string>
			| InputAttributes<"email", string>
			| InputAttributes<"file", globalThis.File>
			| InputAttributes<"hidden", unknown>
			| InputAttributes<"image", string>
			| InputAttributes<"month", number>
			| InputAttributes<"number", number>
			| InputAttributes<"password", string>
			| InputAttributes<"radio", boolean>
			| InputAttributes<"range", number>
			| InputAttributes<"reset", never>
			| InputAttributes<"search", string>
			| InputAttributes<"submit", never>
			| InputAttributes<"tel", string>
			| InputAttributes<"time", string>
			| InputAttributes<"url", string>
			| InputAttributes<"week", number>;
	};
}

export type Component = () => JSX.Element;

export interface Attributes extends EventListenerAttributes {
	id?: ReactiveAttribute<string>;
	class?: ReactiveAttribute<string>;
}

export type ReactiveAttribute<T> = T | (() => T);

export type EventListenerAttributes = {
	[EventType in keyof HTMLElementEventMap as `on${EventType}`]?: (
		event: HTMLElementEventMap[EventType],
	) => void;
};

export interface InputAttributes<TType extends string, TValue>
	extends Attributes {
	type: TType;
	name: string;
	value?: ReactiveAttribute<TValue>;
	onchangevalue?: (value: TValue) => void;
}

export interface LabelAttributes extends Attributes {
	for?: string;
}

export interface AnchorAttributes extends Attributes {
	href: string;
}

export interface ImageAttributes extends Attributes {
	src: string;
	alt: string;
}
