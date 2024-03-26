import { mount, Atom } from "./src/index";

import { Counter } from "./index.demo.counter";
import { Weather } from "./index.demo.weather";

function App(): JSX.Element {
	const demo = Atom<"counter" | "weather">("counter", { name: "demo" });

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
