import { Atom } from "@";

export function Weather(): JSX.Element {
	const state = Atom<
		| { _type: "Ready" }
		| { _type: "Loading" }
		| { _type: "Error"; message: string }
		| { _type: "Ok"; data: unknown }
	>({ _type: "Ready" }, { name: "state" });

	const onFetch = async () => {
		state({ _type: "Loading" });
		try {
			const response = await fetch(
				"https://api.open-meteo.com/v1/forecast?latitude=-33.865143&longitude=151.209900&current=temperature_2m,wind_speed_10m",
			);
			const data = await response.json();
			state({ _type: "Ok", data });
		} catch (e) {
			state({ _type: "Error", message: `${e}` });
		}
	};

	return (
		<div>
			<pre>{() => JSON.stringify(state(), undefined, 2)}</pre>
			<div>
				<button onclick={onFetch}>fetch</button>
			</div>
		</div>
	);
}