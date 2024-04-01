import { mount, Route } from "@";

import { Home } from "./home";
import { Hash } from "./hash";

function App(): JSX.Element {
	return (
		<>
			<Route path="/" element={() => <Home />} />
			<Route path="/hash" element={() => <Hash />} />
		</>
	);
}

mount(document.getElementById("app")!, <App />);
