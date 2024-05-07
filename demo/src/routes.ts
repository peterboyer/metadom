export const routes = new Map<
	string,
	{ title: string; module: () => Promise<unknown> }
>([
	[
		"/",
		{
			title: "Home",
			module: () => import("./routes/1-home.js"),
		},
	],
	[
		"/state",
		{
			title: "State",
			module: () => import("./routes/2-state.js"),
		},
	],
	[
		"/fetch",
		{
			title: "Fetch",
			module: () => import("./routes/3-fetch.js"),
		},
	],
	[
		"/inputs",
		{
			title: "Inputs",
			module: () => import("./routes/4-inputs.js"),
		},
	],
	[
		"/layout",
		{
			title: "Layout",
			module: () => import("./routes/5-layout.js"),
		},
	],
	[
		"/async",
		{
			title: "Async",
			module: () => import("./routes/6-async.js"),
		},
	],
	[
		"/async-loader",
		{
			title: "Async (w/ Loader)",
			module: () => import("./routes/7-async-with-loader.js"),
		},
	],
	[
		"/hash",
		{
			title: "Hash",
			module: () => import("./routes/8-hash.js"),
		},
	],
]);
