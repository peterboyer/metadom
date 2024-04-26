import { Signal } from "./signal.js";

type PromiseState<T> =
	| { _type: "pending" }
	| { _type: "fulfilled"; value: T }
	| { _type: "rejected"; error: unknown };

export function Signal_fromPromise<T>(
	promise: Promise<T>,
): Signal<PromiseState<T>> {
	const signal = Signal<PromiseState<T>>({ _type: "pending" });
	promise
		.then((value) => signal({ _type: "fulfilled", value }))
		.catch((error) => signal({ _type: "rejected", error }));
	return signal;
}
