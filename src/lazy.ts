import { h } from "./jsx.js";

export function lazy(
	callback: () => Promise<unknown>,
): () => Promise<JSX.Element> {
	return async () => {
		const Component = (await callback()) as { default: () => JSX.Element };
		return h(Component.default, {});
	};
}
