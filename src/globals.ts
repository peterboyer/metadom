import type { JSX as _JSX } from "./jsx-runtime.js";

declare global {
	export namespace JSX {
		export type Element = _JSX.Element;
		export type ElementClass = _JSX.ElementClass;
		export type IntrinsicElements = _JSX.IntrinsicElements;
	}
}
