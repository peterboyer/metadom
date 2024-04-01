import * as routing from "./routing";
import { reaction } from "./signal";

export type RouteProps = {
	path: string;
	element: JSX.Component;
};

export function Route({ path, element }: RouteProps): JSX.Element {
	reaction(
		() => routing.url().pathname,
		(pathname) => console.log({ pathname }),
	);
	return <>{() => routing.url().pathname === path && element()}</>;
}
