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
				const modeValue = mode();
				if (modeValue === "counter") {
					return <Counter />;
				}
				if (modeValue === "weather") {
					return <Weather />;
				}
				if (modeValue === "layout") {
					return <Layout />;
				}
				if (modeValue === "async") {
					return <Async />;
				}
				if (modeValue === "async-loader-resolve") {
					return <AsyncWithLoader mode="resolve" />;
				}
				if (modeValue === "async-loader-reject") {
					return <AsyncWithLoader mode="reject" />;
				}
				return null;
			}}
		</main>
	);
}
