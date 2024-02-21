import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "transform",
    jsxImportSource: ".",
    jsxInject: `import { jsx } from '/src/jsx-runtime'`,
    jsxFactory: "jsx",
  },
});
