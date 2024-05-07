import {
	assignLayout,
	assignAsyncPending,
	assignAsyncRejected,
	routing,
} from "metadom";
import { Timeout } from "./shared/timeout.js";

export default async function AsyncWithLoader(): Promise<JSX.Element> {
	const mode = routing.url().searchParams.get("mode") || "resolve";
	const data =
		mode === "resolve"
			? await Timeout(1000, () => new Date().toISOString())
			: await Timeout(1000, () => Promise.reject(new Error("Failed.")));
	return <div>{data}</div>;
}

assignLayout(AsyncWithLoader, (_, children) => {
	console.log("layout");
	return (
		<>
			<pre style="border-color:red;">{children}</pre>
			<div class="mt-4 space-x-2">
				<a class="button" href={`${location.pathname}?mode=resolve`}>
					Resolve
				</a>
				<a class="button" href={`${location.pathname}?mode=reject`}>
					Reject
				</a>
			</div>
		</>
	);
});

assignAsyncPending(AsyncWithLoader, () => {
	return <div>Loading</div>;
});

assignAsyncRejected(AsyncWithLoader, (_, error) => {
	return <div style="color:red;">{"" + error}</div>;
});
