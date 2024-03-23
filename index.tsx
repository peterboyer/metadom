import { atom, mount } from "./src";

import { Counter } from "./index.demo.counter";
import { Weather } from "./index.demo.weather";

function App(): JSX.Element {
  const demo = atom<"counter" | "weather">("counter");

  return (
    <main>
      <fieldset>
        <legend>Demo</legend>
        <input
          type="radio"
          name="demo"
          id="demoCounter"
          value={() => demo() === "counter"}
        />
        <label for="demoCounter">Counter</label>
        <input
          type="radio"
          name="demo"
          id="demoWeather"
          value={() => demo() === "weather"}
        />
        <label for="demoWeather">Weather</label>
      </fieldset>
      {() => demo() === "counter" && <Counter />}
      {() => demo() === "weather" && <Weather />}
    </main>
  );
}

mount(App);
