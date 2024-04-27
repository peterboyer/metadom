import { Signal, reaction } from "metadom";

import { title } from "./shared/nav.js";
import { Counter } from "./hash/counter.js";
import { Weather } from "./hash/weather.js";
import { Layout } from "./hash/layout.js";
import { Async } from "./hash/async.js";
import { Async as AsyncWithLoader } from "./hash/async-with-loader.js";

type Mode =
	| "counter"
	| "weather"
	| "layout"
	| "async"
	| "async-loader-resolve"
	| "async-loader-reject";

export default function (): JSX.Element {
	title("Hash");

	const locationHash_unsafe = (location.hash.substring(1) as Mode) || undefined;
	const mode = Signal<Mode>(locationHash_unsafe ?? "counter");
	reaction(
		() => mode(),
		(value) => {
			location.hash = value;
		},
	);

	return (
		<main>
			<fieldset>
				<legend>Demo</legend>
				{Array.from(
					new Map<Mode, string>([
						["counter", "Counter"],
						["weather", "Weather"],
						["layout", "Layout"],
						["async", "Async"],
						["async-loader-resolve", "Async (w/ Loader) Resolve"],
						["async-loader-reject", "Async (w/ Loader) Reject"],
					]),
				).map(([name, title]) => (
					<>
						<input
							type="radio"
							name={name}
							id={`radio-${name}`}
							value={() => mode() === name}
							onchangevalue={() => mode(name)}
						/>
						<label for={`radio-${name}`}>{title}</label>
					</>
				))}
			</fieldset>
			{() => {
				if (mode() === "counter") {
					return <Counter />;
				}
				if (mode() === "weather") {
					return <Weather />;
				}
				if (mode() === "layout") {
					return <Layout />;
				}
				if (mode() === "async") {
					return <Async />;
				}
				if (mode() === "async-loader-resolve") {
					return <AsyncWithLoader mode="resolve" />;
				}
				if (mode() === "async-loader-reject") {
					return <AsyncWithLoader mode="reject" />;
				}
				return null;
			}}
		</main>
	);
}
