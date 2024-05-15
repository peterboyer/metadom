import { Signal } from "./signal.js";

export const url = Signal(new URL(document.URL));

window.addEventListener("popstate", () => {
	url(new URL(document.URL));
});

export function go(delta: number = 0): void {
	history.go(delta);
	url(new URL(document.URL));
}

export function forward(): void {
	history.forward();
	url(new URL(document.URL));
}

export function back(): void {
	history.back();
	url(new URL(document.URL));
}

export function push(nextUrl: string, state?: Record<string, unknown>): void {
	history.pushState(state, "", nextUrl);
	url(new URL(document.URL));
}

export function replace(
	nextUrl: string,
	state?: Record<string, unknown>,
): void {
	history.replaceState(state, "", nextUrl);
	url(new URL(document.URL));
}
