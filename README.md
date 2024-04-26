<div align="center">

# metadom

**Meta-DOM. Signal-driven, declarative UI.**

[Example](#example) • [Installation](#installation) • [Philosophy](#philosophy)

</div>

# Example

```tsx
import { mount, Signal } from "metadom";

mount(<Counter />);

export function Counter(): JSX.Element {
  const count = Signal(0);

  return (
    <div>
      <dl>
        <dt>Count</dt>
        <dd>{count}</dd>
        <dt>Count * 10</dt>
        <dd>{() => count() * 10}</dd>
      </dl>
      <div>
        <button onclick={() => count((a) => a + 1)}>increment</button>
        <button onclick={() => count((a) => a - 1)}>decrement</button>
      </div>
    </div>
  );
}
```

# Philosophy

- No compilation.
- No virtual-DOM.
- Simple reactivity pattern:
  - A Signal is a Function.
    - When called it returns its value.
    - When called with an argument, it sets it also sets its value.
  - Functions define reactive UI children.
  - Functions define reactive UI attributes.

# Installation

Available on `npm` ([link](https://www.npmjs.com/package/metadom)):

```
metadom
```

## Vite

### Config

Add to your project's `vite.config.ts`:

```diff
+ import Metadom from "metadom/config/vite";

export default defineConfig({
+ plugins: [Metadom()],
});
```

## TypeScript

### Config

Add to your project's `tsconfig.json`:

```diff
{
+ "extends": ["metadom/config/tsconfig.json"],
}
```

### Global JSX Namespace

Instead of having to import the `JSX` namespace for typing your project's
components' return types, you may make it globally available.

#### via `tsconfig.json`:

```diff
{
  "compilerOptions": {
+   "types": ["metadom/globals"],
  }
}
```

#### via entry-point:

```diff
+ import "metadom/globals";
```
