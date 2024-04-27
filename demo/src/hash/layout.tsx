import { assignLayout } from "metadom";

export function Layout() {
	return <p>Content.</p>;
}

assignLayout(Layout, (_, children) => {
	return <div style="border-color:green;">{children}</div>;
});
