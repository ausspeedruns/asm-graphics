import { useState } from "react";
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	InputAdornment,
	OutlinedInput,
	Stack,
	TextField,
} from "@mui/material";
import { styled } from "styled-components";
import _ from "underscore";

import type { War } from "@asm-graphics/types/Incentives";

const StackStyled = styled(Stack)`
	font-size: 2rem;

	h1,
	h2,
	h3 {
		margin: 0;
	}

	h1 {
		font-weight: normal;
	}
`;

type WarProps = {
	incentive: War;
	updateIncentive: (incentive: War) => void;
};

export function WarEdit({ incentive, updateIncentive }: WarProps) {
	const [incentiveOptions, setIncentiveOptions] = useState<War["options"]>(incentive.options);
	const [active, setActive] = useState(incentive.active);
	const [increments, setIncrements] = useState<number[]>(new Array(incentive.options.length).fill(0));

	function UpdateIncentive() {
		if (!incentive.id) return;

		if (incentiveOptions.some((option) => !option.name || isNaN(option.total))) return;

		updateIncentive({
			...incentive,
			options: incentiveOptions,
			active,
		});
	}

	const invalidData = incentiveOptions.some((option) => !option.name || isNaN(option.total)) || !incentive.id;
	const hasEdited = active !== incentive.active || !_.isEqual(incentiveOptions, incentive.options);

	function handleNameChange(newName: string, oldName: string) {
		const mutableOptions = [...incentiveOptions];

		const optionIndex = mutableOptions.findIndex((option) => option.name === oldName);

		let mutableOption = { ...mutableOptions[optionIndex] };
		if (optionIndex > -1) {
			mutableOption.name = newName;
		}

		mutableOptions[optionIndex] = mutableOption;

		setIncentiveOptions(mutableOptions);
	}

	// function handleManualAmountChange(amount: number, name: string) {
	// 	const mutableOptions = [...incentiveOptions];

	// 	const optionIndex = mutableOptions.findIndex((option) => option.name === name);
	// 	if (optionIndex > -1) {
	// 		mutableOptions[optionIndex].total = amount;
	// 	}

	// 	setIncentiveOptions(mutableOptions);
	// }

	function handleIncrementChange(increment: number, index: number) {
		const mutableIncrements = [...increments];
		mutableIncrements[index] = increment;

		setIncrements(mutableIncrements);
	}

	function handleIncrement(index: number) {
		const mutableOption = { ...incentiveOptions[index] };
		mutableOption.total += increments[index];

		const mutableOptions = [...incentiveOptions];
		mutableOptions[index] = mutableOption;

		setIncentiveOptions(mutableOptions);

		handleIncrementChange(0, index);
	}

	function handleRemove(index: number) {
		const mutableOptions = incentiveOptions.filter((_, i) => i !== index);

		setIncentiveOptions(mutableOptions);
	}

	const highestNumber = incentiveOptions.reduce((highest, opt) => (highest < opt.total ? opt.total : highest), -1);

	return (
		<StackStyled gap="medium" alignItems="center">
			<div>
				{incentiveOptions.length > 0 ? (
					<h1>
						<span style={{ fontSize: "75%" }}>Currently</span>{" "}
						<b>{[...incentiveOptions].sort((a, b) => b.total - a.total)[0].name}</b>
					</h1>
				) : (
					<p>No options submitted</p>
				)}
			</div>

			<FormControlLabel
				control={<Checkbox defaultChecked onChange={(_, checked) => setActive(checked)} checked={active} />}
				label="Active"
			/>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "2fr 1fr 0.5fr 1fr 0.5fr",
						gap: "0.5rem 1rem",
						alignItems: "center",
						justifyContent: "center",
						padding: "0 6rem",
						fontSize: "1.5rem",
						margin: "2rem 0",
					}}>
					<span>Name</span>
					<span>Change by</span>
					<span></span>
					<span>Total</span>
					<span></span>
					{incentiveOptions.map((item, i) => {
						return (
							<>
								<TextField
									placeholder="Name"
									onChange={(e) => {
										handleNameChange(e.target.value, item.name);
									}}
									value={item.name}
									key={`input-${i}`}
								/>
								<FormControl fullWidth>
									<OutlinedInput
										type="number"
										value={increments[i]}
										onChange={(e) => {
											handleIncrementChange(parseFloat(e.target.value), i);
										}}
										key={`input-amount-${i}`}
										startAdornment={<InputAdornment position="start">$</InputAdornment>}
									/>
								</FormControl>
								<Button
									onClick={() => handleIncrement(i)}
									disabled={increments[i] === 0}
									color="success"
									key={`add-${i}`}
									variant={increments[i] === 0 ? "outlined" : "contained"}>
									Add
								</Button>
								<span
									style={{
										fontWeight: highestNumber === item.total ? "bold" : "normal",
										fontSize: "1.5rem",
									}}
									key={`total-${i}`}>
									${item.total.toLocaleString()}
								</span>
								<Button
									onClick={() => handleRemove(i)}
									color="error"
									key={`remove-${i}`}
									variant="outlined">
									Remove
								</Button>
							</>
						);
					})}
				</div>
			</div>
			{incentive.type === "War" && (
				<Button
					style={{ marginTop: 8 }}
					color="success"
					variant="outlined"
					onClick={() => {
						const mutableOptions = [...incentiveOptions];
						mutableOptions.push({
							name: "",
							total: 0,
						});
						setIncentiveOptions(mutableOptions);
					}}>
					+ Add New Option
				</Button>
			)}

			<br />
			<Button
				onClick={UpdateIncentive}
				disabled={invalidData || !hasEdited}
				variant="contained"
				color="success"
				fullWidth>
				Update
			</Button>
		</StackStyled>
	);
}
