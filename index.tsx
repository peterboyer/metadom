import { mount, Atom, reaction } from "./src/index";

import { Counter } from "./index.demo.counter";
import { Weather } from "./index.demo.weather";

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
				<input
					type="radio"
					name="demo"
					id="demoCounter"
					value={() => demo() === "counter"}
					onchangevalue={() => demo("counter")}
				/>
				<label for="demoCounter">Counter</label>
				<input
					type="radio"
					name="demo"
					id="demoWeather"
					value={() => demo() === "weather"}
					onchangevalue={() => demo("weather")}
				/>
				<label for="demoWeather">Weather</label>
			</fieldset>
			{() => demo() === "counter" && <Counter />}
			{() => demo() === "weather" && <Weather />}
		</main>
	);
}

mount(App);
