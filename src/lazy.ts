import { h } from "./jsx.js";

export function lazy(
	callback: () => Promise<unknown>,
): () => Promise<JSX.Element> {
	let Component: (() => JSX.Element) | undefined = undefined;
	return async () => {
		// This fixes unmounting fix?! Caching the previous Component result?!
		if (!Component) {
			Component = ((await callback()) as { default: () => JSX.Element })
				.default;
		}
		return h(Component, {});
	};
}
