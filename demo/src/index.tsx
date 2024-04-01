import { mount, routing } from "@";

import { Nav } from "./shared/nav";
import { Home } from "./home";
import { Hash } from "./hash";

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
