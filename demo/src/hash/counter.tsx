import { Signal } from "@";

export function Counter(): JSX.Element {
	const count = Signal(0, { name: "count" });

	return (
		<div>
			<dl>
				<dt>Count</dt>
				<dd>{count}</dd>
				<dt>Count * 10</dt>
				<dd>{() => count() * 10}</dd>
			</dl>
			<div>
				<button onclick={() => count((a) => a + 1)}>increment</button>
				<button onclick={() => count((a) => a - 1)}>decrement</button>
			</div>
		</div>
	);
}
