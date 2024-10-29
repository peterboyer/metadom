import { Signal, reaction } from "metadom";

export default function* State(): JSX.Element {
	const count = Signal(0);

	yield reaction(count, console.log);

	return (
		<>
			<dl>
				<dt>Count</dt>
				<dd>
					<pre>{count}</pre>
				</dd>
			</dl>
			<dl>
				<dt>Count * 10</dt>
				<dd>
					<pre>{() => count() * 10}</pre>
				</dd>
			</dl>
			<div class="space-x-2">
				<button onclick={() => count((a) => a + 1)}>increment</button>
				<button onclick={() => count((a) => a - 1)}>decrement</button>
			</div>
		</>
	);
}
