// anything reactive must be a callback in jsx
// atoms when called must return their value, no wrappers
// atoms when changed will trigger their reactive subscribers

export type Atom<T = unknown> = ((...args: [] | [nextValue: T]) => T) & {
  _type: "atom";
  value: T;
  callbacks: (() => void)[];
};

let onAtom: (atom: Atom) => void = () => {};

export const listen = <T>(callback: () => T): { result: T; atoms: Atom[] } => {
  const atoms: Atom[] = [];
  onAtom = (atom) => {
    atoms.push(atom);
  };
  const result = callback();
  return { result, atoms };
};

export const atom = <T>(initialValue: T): Atom<T> => {
  const atom: Atom<T> = Object.assign(
    (...args: [] | [nextValue: T]) => {
      if (args.length) {
        // write
        const [nextValue] = args;
        atom.value = nextValue;
        atom.callbacks.forEach((callback) => callback());
      } else {
        // read
        onAtom(atom as Atom<unknown>);
      }
      return atom.value;
    },
    {
      _type: "atom" as const,
      value: initialValue,
      callbacks: [],
    },
  );
  return atom;
};
