export function getData(
	mode: "resolve" | "reject" = "resolve",
): Promise<string> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const value = new Date().toISOString();
			return mode === "reject" ? reject(value) : resolve(value);
		}, 1000);
	});
}

export async function Async(): Promise<JSX.Element> {
	const data = await getData();
	return <div>{data}</div>;
}

export async function AsyncWithLoader({
	mode,
}: {
	mode: NonNullable<Parameters<typeof getData>[0]>;
}) {
	return <div>{await getData(mode)}</div>;
}

AsyncWithLoader.Pending = function () {
	return <div>Loading</div>;
};

AsyncWithLoader.Rejected = function () {
	return <div>Error</div>;
};
