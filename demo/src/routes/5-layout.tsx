import { assignLayout } from "metadom";

export default function Layout(): JSX.Element {
	return "Content.";
}

assignLayout(Layout, (_, children) => {
	return <div class="border border-green-600 p-4">{children}</div>;
});
