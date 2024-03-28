import { defineConfig } from "vite";

export default defineConfig({
	root: "demo",
	resolve: {
		alias: {
			"@": "../src/index.ts",
		},
	},
	esbuild: {
		jsx: "transform",
		jsxImportSource: ".",
		jsxInject: `import { jsx } from '../src/jsx-runtime'`,
		jsxFactory: "jsx",
	},
});
