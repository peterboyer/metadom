import { lazy } from "metadom";

export const routes = new Map<
	string,
	{ title: string; module: () => Promise<JSX.Element> }
>([
	[
		"/",
		{
			title: "Home",
			module: lazy(() => import("./routes/1-home.js")),
		},
	],
	[
		"/state",
		{
			title: "State",
			module: lazy(() => import("./routes/2-state.js")),
		},
	],
	[
		"/fetch",
		{
			title: "Fetch",
			module: lazy(() => import("./routes/3-fetch.js")),
		},
	],
	[
		"/inputs",
		{
			title: "Inputs",
			module: lazy(() => import("./routes/4-inputs.js")),
		},
	],
	[
		"/layout",
		{
			title: "Layout",
			module: lazy(() => import("./routes/5-layout.js")),
		},
	],
	[
		"/async",
		{
			title: "Async",
			module: lazy(() => import("./routes/6-async.js")),
		},
	],
	[
		"/async-loader",
		{
			title: "Async (w/ Loader)",
			module: lazy(() => import("./routes/7-async-with-loader.js")),
		},
	],
	[
		"/hash",
		{
			title: "Hash",
			module: lazy(() => import("./routes/8-hash.js")),
		},
	],
]);
