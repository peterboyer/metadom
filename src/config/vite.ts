export default function () {
	return {
		name: "metadom",
		config() {
			return {
				esbuild: {
					jsx: "transform",
					jsxDev: false,
					jsxImportSource: "metadom",
					jsxInject: `import { jsx } from "metadom";`,
					jsxFactory: "jsx",
					jsxFragment: "jsx.Fragment",
				},
			} as const;
		},
	};
}
