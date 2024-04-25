export default function () {
	return {
		name: "metadom",
		config() {
			return {
				esbuild: {
					jsx: "transform",
					jsxDev: false,
					jsxImportSource: "metadom",
					jsxInject: `import { h } from "metadom";`,
					jsxFactory: "h",
					jsxFragment: "h.Fragment",
				},
			} as const;
		},
	};
}
