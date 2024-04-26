import { title } from "./shared/nav.js";

export default function (): JSX.Element {
	title("Form");

	return (
		<form>
			{(
				[
					"text",
					"email",
					"password",
					"search",
					"tel",
					"date",
					"datetime-local",
					"time",
					"week",
					"month",
					"number",
					"checkbox",
					"file",
				] as const
			).map((type) => (
				<label for={undefined}>
					{type}
					<input
						name={type}
						type={type as any}
						value={undefined}
						onchangevalue={console.log}
					/>
				</label>
			))}
			<hr />
			<label for={undefined}>
				range
				<input
					name="range"
					type="range"
					min={0}
					max={11}
					value={undefined}
					onchangevalue={console.log}
				/>
			</label>
		</form>
	);
}
