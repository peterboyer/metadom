export default function Home(): JSX.Element {
	return (
		<ul class="space-y-4">
			<li>No virtual DOM.</li>
			<li>No compilation required; JSX optional.</li>
			<li>Simple reactivity model:</li>
			<ul class="ml-8 list-disc">
				<li>A Signal is a function.</li>
				<li>
					<code>counter()</code> gets the value.
				</li>
				<li>
					<code>counter(0)</code> sets the value.
				</li>
				<li>
					<code>{"counter((prev) => prev + 1)"}</code> sets the value.
				</li>
			</ul>
			<li>Reactivity through as child-node functions.</li>
			<li>
				Hypertag <code>h</code> is fully typed.
			</li>
		</ul>
	);
}
