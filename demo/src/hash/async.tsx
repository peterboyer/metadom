import { Timeout } from "./shared/timeout.js";

export async function Async(): Promise<JSX.Element> {
	const data = await Timeout(1000, () => new Date().toISOString());
	return <div>{data}</div>;
}
