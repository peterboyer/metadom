export function mount(component: JSX.Component): Node {
	const element = component();
	document.body.append(element);
	return element;
}
