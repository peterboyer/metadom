import type { Component } from "./jsx-runtime.js";

export function mount(component: Component) {
	const element = component();
	document.body.append(element);
}
