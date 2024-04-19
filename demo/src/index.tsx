import "metadom/jsx-global";
import { mount, routing } from "metadom";

import { Nav } from "./shared/nav.js";
import { Home } from "./home.js";
import { Hash } from "./hash.js";

function App(): JSX.Element {
	return (
		<>
			<Nav />
			{() => routing.url().pathname === "/" && <Home />}
			{() => routing.url().pathname === "/hash" && <Hash />}
		</>
	);
}

mount(<App />);
