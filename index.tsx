import { atom, mount } from "./src";

function App(): JSX.Element {
  const count = atom(0);
  return (
    <div>
      {count}
      <button onclick={() => count(count() + 1)}>increment</button>
    </div>
  );
}

mount(App);
