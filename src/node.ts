import type { Disposer } from "./disposer.js";

export type NodeExtended = Node & {
	_disposers?: Set<Disposer>;
	_disposersKeyed?: Map<string, Disposer>;
};

export type ElementExtended = Element & NodeExtended;
