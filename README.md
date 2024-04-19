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

## Vite

### Config

Add to your project's `vite.config.ts`:

```diff
+ import Metadom from "metadom/config/vite";

export default defineConfig({
+	plugins: [Metadom()],
})
```

## TypeScript

### Config

Add to your project's `tsconfig.json`:

```diff
{
+	"extends": ["metadom/config/tsconfig.json"],
}
```

### Global JSX Namespace

Instead of having to `import type { JSX } from "metadom";` you can make it
globally available.

#### via `tsconfig.json`:

```diff
{
	"compilerOptions": {
+		"types": ["metadom/jsx-global"]
	}
}
```

#### via entry-point:

```diff
+ import "metadom/jsx-global";
```
