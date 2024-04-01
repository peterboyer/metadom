import { Atom } from "./atom";

const pathname = Atom(location.pathname);

export type RouteProps = {
	path: string;
	element: JSX.Component;
};

export function Route({ path, element }: RouteProps): JSX.Element {
	return <>{() => pathname() === path && element()}</>;
}
