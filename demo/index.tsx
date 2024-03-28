import { mount, Atom, reaction } from "@";

import { Counter } from "./counter";
import { Weather } from "./weather";

function App(): JSX.Element {
	const locationHash_unsafe = (location.hash.substring(1) as any) || undefined;
	const demo = Atom<"counter" | "weather">(locationHash_unsafe ?? "counter");
	reaction(
		() => demo(),
		(value) => {
			location.hash = value;
		},
	);

	return (
		<main>
			<fieldset>
				<legend>Demo</legend>
				{(["counter", "weather"] as const).map((name) => (
					<>
						<input
							type="radio"
							name={name}
							id={`radio-${name}`}
							value={() => demo() === name}
							onchangevalue={() => demo(name)}
						/>
						<label for={`radio-${name}`}>{name}</label>
					</>
				))}
			</fieldset>
			{() => demo() === "counter" && <Counter />}
			{() => demo() === "weather" && <Weather />}
		</main>
	);
}

mount(App);
