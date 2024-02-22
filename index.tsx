import { atom, mount } from "./src";

function App(): JSX.Element {
  return (
    <main>
      <Counter />
      <hr />
      <Weather />
    </main>
  );
}

export function Counter(): JSX.Element {
  const count = atom(0);

  return (
    <div>
      <dl>
        <dt>Count</dt>
        <dd>{count}</dd>
        <dt>Count * 10</dt>
        <dd>{() => count() * 10}</dd>
      </dl>
      <div>
        <button onclick={() => count(count() + 1)}>increment</button>
        <button onclick={() => count(count() - 1)}>decrement</button>
      </div>
    </div>
  );
}

export function Weather(): JSX.Element {
  const state = atom<
    | { _type: "Ready" }
    | { _type: "Loading" }
    | { _type: "Error"; message: string }
    | { _type: "Ok"; data: unknown }
  >({ _type: "Ready" });

  const onFetch = async () => {
    state({ _type: "Loading" });
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-33.865143&longitude=151.209900&current=temperature_2m,wind_speed_10m",
      );
      const data = await response.json();
      state({ _type: "Ok", data });
    } catch (e) {
      state({ _type: "Error", message: `${e}` });
    }
  };

  return (
    <div>
      <pre>{() => JSON.stringify(state(), undefined, 2)}</pre>
      <div>
        <button onclick={onFetch}>fetch</button>
      </div>
    </div>
  );
}

mount(App);
