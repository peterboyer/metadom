import { Signal } from "metadom";

export const title = Signal("Demo");

export function Nav(): JSX.Element {
	return (
		<>
			<h1>{title}</h1>
			<nav>
				<ul>
					<li>
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/hash">Hash</a>
					</li>
					<li>
						<a href="/form">Form</a>
					</li>
				</ul>
			</nav>
		</>
	);
}
