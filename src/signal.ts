import type { Disposer } from "./disposer";

export interface Signal<T = unknown> {
	/**
	 * Getter.
	 */
	(): T;

	/**
	 * Setter.
	 */
	(nextValue: T | ((prevValue: T) => T)): T;

	value: T;
	callbacks: Set<() => void>;
	title?: string | undefined;
}

let onSignal: undefined | ((signal: Signal) => void) = undefined;

export function Signal<T>(
	initialValue: T,
	options?: { name?: string },
): Signal<T> {
	const signal: Signal<T> = (
		...args: [] | [nextValue: T | ((prevValue: T) => T)]
	) => {
		if (!args.length) {
			// read
			onSignal?.(signal as Signal<unknown>);
		} else {
			// write
			const [nextValue] = args;
			if (typeof nextValue === "function") {
				const nextValue_unsafe = nextValue as (prevValue: T) => T;
				signal.value = nextValue_unsafe(signal.value);
			} else {
				signal.value = nextValue;
			}
			// Dereference current set of callbacks to avoid infinite recursion.
			Array.from(signal.callbacks).forEach((callback) => callback());
		}
		return signal.value;
	};

	signal.value = initialValue;
	signal.callbacks = new Set<() => void>();
	signal.title = options?.name;

	return signal;
}

export function reaction<T>(
	fn: () => T,
	callback?: (result: T) => void,
): Disposer {
	const signals = new Set<Signal>();
	const disposer = () => {
		signals.forEach((signal) => signal.callbacks.delete(evaluate));
		signals.clear();
	};

	const evaluate = () => {
		disposer();

		onSignal = (signal) => signals.add(signal);
		const result = fn();
		onSignal = undefined;

		callback?.(result);

		signals.forEach((signal) => signal.callbacks.add(evaluate));
	};

	evaluate();

	return disposer;
}
