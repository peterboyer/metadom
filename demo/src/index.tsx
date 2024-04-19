import "metadom/jsx-global";
import { mount, routing } from "metadom";

import { Nav } from "./shared/nav.js";

function App(): JSX.Element {
	return (
		<>
			<Nav />
			{() => routing.url().pathname === "/" && import("./home.js")}
			{() => routing.url().pathname === "/hash" && import("./hash.js")}
			<footer>Footer</footer>
		</>
	);
}

mount(<App />);
