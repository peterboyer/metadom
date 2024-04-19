import "metadom/globals";
import { mount, routing } from "metadom";

import { Nav } from "./shared/nav.js";

function App(): JSX.Element {
	return (
		<>
			<Nav />
			{() => {
				if (routing.url().pathname === "/") {
					return import("./home.js");
				} else if (routing.url().pathname === "/hash") {
					return import("./hash.js");
				} else {
					return;
				}
			}}
			<footer>Footer</footer>
		</>
	);
}

mount(<App />);
