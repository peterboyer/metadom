import type { Disposer } from "./disposer.js";

export interface Signal<T = unknown> {
	/* get */ (): T;
	/* set */ (nextValue: T | ((prevValue: T) => T)): T;

	value: T;
	callbacks: Set<() => void>;
	title?: string | undefined;
}

let onSignal: undefined | ((signal: Signal) => void) = undefined;

export function Signal<T>(initialValue: T): Signal<T> {
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
	return signal;
}

export function reaction<T>(
	input: () => T,
	effect?: (result: T) => void,
	cleanup?: () => void,
): Disposer {
	let isDisposed = false;
	const signals = new Set<Signal>();
	const evaluate = () => {
		cleanup?.();

		signals.forEach((signal) => signal.callbacks.delete(evaluate));
		signals.clear();

		if (isDisposed) {
			return;
		}

		const onSignal_reset = onSignal;
		onSignal = (signal) => signals.add(signal);
		const result = input();
		onSignal = onSignal_reset;

		effect?.(result);

		signals.forEach((signal) => signal.callbacks.add(evaluate));
	};

	evaluate();

	return () => {
		isDisposed = true;
		signals.forEach((signal) => signal.callbacks.delete(evaluate));
		signals.clear();
	};
}
