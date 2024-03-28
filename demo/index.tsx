import { mount, Atom, reaction } from "@";

import { Counter } from "./counter";
import { Weather } from "./weather";

type Mode = "counter" | "weather";

function App(): JSX.Element {
	const locationHash_unsafe = (location.hash.substring(1) as Mode) || undefined;
	const mode = Atom<Mode>(locationHash_unsafe ?? "counter");
	reaction(
		() => mode(),
		(value) => {
			location.hash = value;
		},
	);

	return (
		<main>
			<fieldset>
				<legend>Demo</legend>
				{Array.from(
					new Map<Mode, string>([
						["counter", "Counter"],
						["weather", "Weather"],
					]),
				).map(([name, title]) => (
					<>
						<input
							type="radio"
							name={name}
							id={`radio-${name}`}
							value={() => mode() === name}
							onchangevalue={() => mode(name)}
						/>
						<label for={`radio-${name}`}>{title}</label>
					</>
				))}
			</fieldset>
			{() => mode() === "counter" && <Counter />}
			{() => mode() === "weather" && <Weather />}
		</main>
	);
}

mount(App);
