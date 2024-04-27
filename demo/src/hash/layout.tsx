import { assignLayout } from "metadom";

export function Layout() {
	return "Content.";
}

assignLayout(Layout, (_, children) => {
	return <div style="border-color:green;">{children}</div>;
});
