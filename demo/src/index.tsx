import { mount, Route } from "@";

import { Hash } from "./hash";

function App(): JSX.Element {
	return (
		<>
			<Route path="/" element={() => <div>Home</div>} />
			<Route path="/hash" element={() => <Hash />} />
		</>
	);
}

mount(document.getElementById("app")!, <App />);
