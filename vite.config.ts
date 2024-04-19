import { defineConfig } from "vite";
import Metadom from "./src/config/vite";

export default defineConfig({
	plugins: [Metadom()],
	root: "demo",
	server: { port: 3000 },
	preview: { port: 3000 },
	resolve: {
		alias: {
			metadom: new URL("./src", import.meta.url).pathname,
		},
	},
});
