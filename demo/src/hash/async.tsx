export function getData(
	mode: "resolve" | "reject" = "resolve",
): Promise<string> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const value = new Date().toISOString();
			return mode === "reject" ? reject(new Error(value)) : resolve(value);
		}, 1000);
	});
}

export async function Async(): Promise<JSX.Element> {
	const data = await getData();
	return <div>{data}</div>;
}

type AsyncWithLoaderProps = {
	mode: NonNullable<Parameters<typeof getData>[0]>;
};

export async function AsyncWithLoader({ mode }: AsyncWithLoaderProps) {
	const data = await getData(mode);
	return <div>{data}</div>;
}

// Render as the wrapper around all states of the Component.
AsyncWithLoader.Layout = function (children: unknown) {
	return <section style="border-color:red;">{children}</section>;
};

// Render while Component's Promise is pending.
AsyncWithLoader.Pending = function () {
	return <div>Loading</div>;
};

// Render if the Component's Promise rejects.
AsyncWithLoader.Rejected = function (error: unknown) {
	return (
		<div>
			Error {"" + error} {JSON.stringify(error)}
		</div>
	);
};
