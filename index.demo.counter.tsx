import { $, atom } from "./src";

export function Counter(): JSX.Element {
	const count = atom(0, { name: "count" });

	return (
		<div>
			<dl>
				<dt>Count</dt>
				<dd>{$(() => count())}</dd>
				<dt>Count * 10</dt>
				<dd>{$(() => count() * 10)}</dd>
			</dl>
			<div>
				<button onclick={() => count(count() + 1)}>increment</button>
				<button onclick={() => count(count() - 1)}>decrement</button>
			</div>
		</div>
	);
}
