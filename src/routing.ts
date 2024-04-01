import { Signal } from "./signal";

export const url = Signal(new URL(document.URL));

export function push(nextUrl: string, state?: Record<string, unknown>): void {
	history.pushState(state, "", nextUrl);
	url(new URL(nextUrl));
}
