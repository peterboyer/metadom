import { mount, routing } from "@";

import { Home } from "./home";
import { Hash } from "./hash";

function App(): JSX.Element {
	return (
		<>
			{() => routing.url().pathname === "/" && <Home />}
			{() => routing.url().pathname === "/hash" && <Hash />}
		</>
	);
}

mount(<App />);
