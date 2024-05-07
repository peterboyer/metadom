export default function Inputs(): JSX.Element {
	return (
		<form class="space-y-4">
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
						type={type}
						value={undefined}
						oninputvalue={(value: unknown) => console.log("input", type, value)}
						onchangevalue={(value: unknown) =>
							console.log("change", type, value)
						}
					/>
				</label>
			))}
			<label for={undefined}>
				range
				<input
					name="range"
					type="range"
					min={0}
					max={11}
					oninputvalue={(value) => console.log("input", "range", value)}
					onchangevalue={(value) => console.log("change", "range", value)}
				/>
			</label>
		</form>
	);
}
