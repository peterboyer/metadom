import { Signal, reaction } from "metadom";

export default function* Hash(): JSX.Element {
	const hash = Signal<string>(location.hash.substring(1) || "aaa");

	yield reaction(
		() => hash(),
		(value) => {
			// TODO: update this without popstate triggering URL signal to reload routes
			location.hash = value;
		},
	);

	return (
		<>
			<pre>
				{() => {
					const hashValue = hash();
					if (hashValue === "aaa") {
						return `Rendered if location.hash is === "aaa".`;
					} else if (hashValue === "bbb") {
						return `Rendered if location.hash is === "bbb".`;
					} else {
						return `Unhandled location.hash value.`;
					}
				}}
			</pre>
			<fieldset>
				<legend>Options</legend>
				{Array.from(
					new Map<string, string>([
						["aaa", "AAA"],
						["bbb", "BBB"],
						["unhandled", "Unhandled"],
					]),
				).map(([name, title]) => (
					<>
						<label for={`radio-${name}`}>
							{title}
							<input
								type="radio"
								name="radio"
								id={`radio-${name}`}
								value={() => hash() === name}
								onchangevalue={() => hash(name)}
							/>
						</label>
					</>
				))}
			</fieldset>
		</>
	);
}
