import { Signal, reaction } from "@";

import { Counter } from "./hash/counter";
import { Weather } from "./hash/weather";

type Mode = "counter" | "weather";

export function Hash(): JSX.Element {
	const locationHash_unsafe = (location.hash.substring(1) as Mode) || undefined;
	const mode = Signal<Mode>(locationHash_unsafe ?? "counter");
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
