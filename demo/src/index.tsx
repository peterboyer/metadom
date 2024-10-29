import "metadom/globals";

import "./index.css";
import { Signal, assignLayout, mount, reaction, routing } from "metadom";

import { routes } from "./routes.js";
import IconGithub from "./index/icon-github.svg";
import IconNpm from "./index/icon-npm.svg";

function* App() {
	const currentRoute = Signal<
		undefined | (typeof routes extends Map<unknown, infer R> ? R : never)
	>(undefined);

	yield reaction(
		() => {
			const pathname = routing.url().pathname;
			const route = routes.get(pathname);
			return route;
		},
		(route) => {
			currentRoute(route);
			window.document.title = route?.title ?? "404";
		},
	);

	return () => {
		const route = currentRoute();
		if (route) {
			return <route.module />;
		}
		return <div>Not Found</div>;
	};
}

assignLayout(App, (_, children) => {
	return (
		<main class="m-8 space-y-4">
			<div class="text-lg font-bold">metadom</div>
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
			<article class="space-y-4">{children}</article>
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
