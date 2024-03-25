// anything reactive must be a callback in jsx
// atoms when called must return their value, no wrappers
// atoms when changed will trigger their reactive subscribers

export type Atom<T = unknown> = ((...args: [] | [nextValue: T]) => T) & {
	$atom: {
		value: T;
		callbacks: Set<() => void>;
		name?: string | undefined;
	};
};

let onAtom: undefined | ((atom: Atom) => void) = undefined;

export const atom = <T>(
	initialValue: T,
	options?: { name?: string },
): Atom<T> => {
	const atom: Atom<T> = Object.assign(
		(...args: [] | [nextValue: T]) => {
			if (args.length) {
				// write
				const [nextValue] = args;
				atom.$atom.value = nextValue;
				// Dereference current set of callbacks to avoid infinite recursion.
				Array.from(atom.$atom.callbacks).forEach((callback) => callback());
			} else {
				// read
				onAtom?.(atom as Atom<unknown>);
			}
			return atom.$atom.value;
		},
		{
			$atom: {
				value: initialValue,
				callbacks: new Set<() => void>(),
				name: options?.name,
			},
		},
	);
	return atom;
};

type Disposer = () => void;

export function reaction<T>(
	fn: () => T,
	callback?: (result: T) => void,
): Disposer {
	const atoms = new Set<Atom>();
	const disposer = () => {
		atoms.forEach((atom) => atom.$atom.callbacks.delete(evaluate));
		atoms.clear();
	};

	const evaluate = () => {
		disposer();

		onAtom = (atom) => atoms.add(atom);
		const result = fn();
		onAtom = undefined;

		callback?.(result);

		atoms.forEach((atom) => atom.$atom.callbacks.add(evaluate));
	};

	evaluate();

	return disposer;
}
