export type Reactor<T extends unknown> = { $: () => T };

export function $<T extends unknown>(callback: () => T): Reactor<T> {
	return { $: callback };
}

export function isReactor(value: unknown): value is Reactor<() => unknown> {
	return !!(
		value &&
		typeof value === "object" &&
		"$" in value &&
		typeof value.$ === "function"
	);
}
