import { Timeout } from "./shared/timeout.js";

export default async function Async(): Promise<JSX.Element> {
	const data = await Timeout(1000, () => new Date().toISOString());
	return <pre>{data}</pre>;
}
