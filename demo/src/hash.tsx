import { Signal, reaction } from "metadom";

import { title } from "./shared/nav.js";
import { Counter } from "./hash/counter.js";
import { Weather } from "./hash/weather.js";

type Mode = "counter" | "weather";

export default Hash;
export function Hash(): JSX.Element {
	title("Hash");

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
