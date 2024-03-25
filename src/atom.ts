// anything reactive must be a callback in jsx
// atoms when called must return their value, no wrappers
// atoms when changed will trigger their reactive subscribers

export interface Atom<T = unknown> {
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

let onAtom: undefined | ((atom: Atom) => void) = undefined;

export function Atom<T>(initialValue: T, options?: { name?: string }): Atom<T> {
	const atom: Atom<T> = (
		...args: [] | [nextValue: T | ((prevValue: T) => T)]
	) => {
		if (!args.length) {
			// read
			onAtom?.(atom as Atom<unknown>);
		} else {
			// write
			const [nextValue] = args;
			if (typeof nextValue === "function") {
				const nextValue_unsafe = nextValue as (prevValue: T) => T;
				atom.value = nextValue_unsafe(atom.value);
			} else {
				atom.value = nextValue;
			}
			// Dereference current set of callbacks to avoid infinite recursion.
			Array.from(atom.callbacks).forEach((callback) => callback());
		}
		return atom.value;
	};

	atom.value = initialValue;
	atom.callbacks = new Set<() => void>();
	atom.title = options?.name;

	return atom;
}

type Disposer = () => void;

export function reaction<T>(
	fn: () => T,
	callback?: (result: T) => void,
): Disposer {
	const atoms = new Set<Atom>();
	const disposer = () => {
		atoms.forEach((atom) => atom.callbacks.delete(evaluate));
		atoms.clear();
	};

	const evaluate = () => {
		disposer();

		onAtom = (atom) => atoms.add(atom);
		const result = fn();
		onAtom = undefined;

		callback?.(result);

		atoms.forEach((atom) => atom.callbacks.add(evaluate));
	};

	evaluate();

	return disposer;
}
