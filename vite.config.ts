import { defineConfig } from "vite";

export default defineConfig({
	root: "demo",
	server: { port: 3000 },
	preview: { port: 3000 },
	resolve: {
		alias: {
			"@": new URL("./src", import.meta.url).pathname,
		},
	},
	esbuild: {
		jsx: "transform",
		jsxDev: false,
		jsxImportSource: "@",
		jsxInject: `import { jsx } from "@/jsx-runtime";`,
		jsxFactory: "jsx",
		jsxFragment: "jsx.Fragment",
	},
});
