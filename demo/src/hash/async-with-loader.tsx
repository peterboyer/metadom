import { assignLayout, assignAsyncPending, assignAsyncRejected } from "metadom";
import { Timeout } from "./shared/timeout.js";

export async function Async(props: { mode: "resolve" | "reject" }) {
	const data =
		props.mode === "resolve"
			? await Timeout(1000, () => new Date().toISOString())
			: await Timeout(1000, () => Promise.reject(new Error("Failed.")));
	return <div>{data}</div>;
}

assignLayout(Async, (_, children) => {
	return <section style="border-color:red;">{children}</section>;
});

assignAsyncPending(Async, () => {
	return <div>Loading</div>;
});

assignAsyncRejected(Async, (_, error) => {
	return <div style="color:red;">{"" + error}</div>;
});
