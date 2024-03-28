export {};

declare global {
	module JSX {
		type IntrinsicElements = {
			div: Attributes;
			main: Attributes;
			dl: Attributes;
			dt: Attributes;
			dd: Attributes;
			pre: Attributes;
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

		type Element = globalThis.Element;
		type ElementClass = never;
		type Component = () => JSX.Element;
	}
}

type ReactiveAttribute<T> = T | (() => T);

interface Attributes extends EventListenerAttributes {
	id?: ReactiveAttribute<string>;
	class?: ReactiveAttribute<string>;
}

type EventListenerAttributes = {
	[EventType in keyof HTMLElementEventMap as `on${EventType}`]?: (
		event: HTMLElementEventMap[EventType],
	) => void;
};

interface InputAttributes<TType extends string, TValue> extends Attributes {
	type: TType;
	name: string;
	value?: ReactiveAttribute<TValue>;
	onchangevalue?: (value: TValue) => void;
}

interface LabelAttributes extends Attributes {
	for?: string;
}
