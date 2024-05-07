import "metadom/globals";

import "./index.css";
import { Signal, assignLayout, mount, routing } from "metadom";

import { routes } from "./routes.js";
import IconGithub from "./index/icon-github.svg";
import IconNpm from "./index/icon-npm.svg";

const title = Signal<string | undefined>("Demo");

function App(): JSX.Element {
	return () => {
		const pathname = routing.url().pathname;
		const route = routes.get(pathname);
		if (route) {
			title(route.title);
			return route.module();
		}
		title("404");
		return <div>Not Found</div>;
	};
}

assignLayout(App, (_, children) => {
	return (
		<main class="m-8 space-y-4">
			<div>metadom</div>
			<hr />
			<ul class="flex flex-wrap gap-2">
				{Array.from(routes.entries())
					.filter(([, route]) => route.title)
					.map(([href, { title }]) => (
						<li>
							<a
								href={href}
								class="button"
								aria-selected={() => routing.url().pathname === href}
							>
								{title}
							</a>
						</li>
					))}
			</ul>
			<hr />
			<article>{children}</article>
			<hr />
			<footer class="text-sm space-x-2">
				<a
					href="https://github.com/peterboyer/metadom"
					class="inline-block w-8 h-8"
				>
					<img src={IconGithub} alt="Github" />
				</a>
				<a
					href="https://www.npmjs.com/package/metadom"
					class="inline-block w-8 h-8"
				>
					<img src={IconNpm} alt="NPM" />
				</a>
			</footer>
		</main>
	);
});

(window as any).unmount = mount(<App />);
