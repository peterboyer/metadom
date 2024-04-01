import { location } from "./jsx";
import { reaction } from "./signal";

export type RouteProps = {
	path: string;
	element: JSX.Component;
};

export function Route({ path, element }: RouteProps): JSX.Element {
	reaction(
		() => location.pathname(),
		(pathname) => console.log({ pathname }),
	);
	return <>{() => location.pathname() === path && element()}</>;
}
