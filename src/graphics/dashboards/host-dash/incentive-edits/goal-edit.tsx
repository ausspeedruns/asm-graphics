import { useState } from "react";
import { styled } from "styled-components";
import { Button, Checkbox, FormControl, FormControlLabel, InputAdornment, OutlinedInput, Stack } from "@mui/material";

import type { Goal } from "@asm-graphics/types/Incentives";
import NumberField from "../../../elements/number-field";

const StackStyled = styled(Stack)`
	font-size: 2rem;

	h1,
	h2,
	h3 {
		margin: 0;
	}
`;

type GoalProps = {
	incentive: Goal;
	updateIncentive: (incentive: Goal) => void;
};

export function GoalEdit({ incentive, updateIncentive }: GoalProps) {
	const [total, setTotal] = useState<Goal["total"]>(incentive.total);

	const [active, setActive] = useState(incentive.active);
	const [add, setAdd] = useState(0);

	function UpdateIncentive() {
		if (!incentive.id) return;

		if (isNaN(total) || isNaN(incentive.goal)) return;

		let activeState = active;

		if (total >= incentive.goal) {
			setActive(false);
			activeState = false;
		}

		updateIncentive({
			...incentive,
			total,
			active: activeState,
		});
	}

	function handleAdd() {
		setTotal(total + add);
		setAdd(0);
	}

	const invalidData = isNaN(total) || isNaN(incentive.goal) || !incentive.id || total < 0;
	const hasEdited = total !== incentive.total || active !== incentive.active;

	return (
		<StackStyled gap="medium" alignItems="center">
			<FormControlLabel
				control={<Checkbox defaultChecked onChange={(_, checked) => setActive(checked)} checked={active} />}
				label="Active"
			/>
			<h2>
				${total.toLocaleString() ?? 0} / ${incentive.goal}
			</h2>

			<p>
				Needs ${incentive.goal - total} more dollars. {Math.round((total / incentive.goal) * 100)}% of the way
				there.
			</p>

			<h1></h1>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "2fr 1fr",
					width: "50%",
					gap: "1rem",
					margin: "2rem 0",
				}}
			>
				<FormControl fullWidth>
					<NumberField
						value={add}
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
						onValueChange={(value) => setAdd(value ?? 0)}
					/>
				</FormControl>
				<Button
					disabled={add === 0}
					onClick={handleAdd}
					variant={add === 0 ? "outlined" : "contained"}
					color={add < 0 ? "error" : "success"}
				>
					{add < 0 ? "Remove" : "Add"}
				</Button>
			</div>
			<br />
			<Button
				fullWidth
				onClick={UpdateIncentive}
				disabled={invalidData || !hasEdited}
				variant="contained"
				color="success"
			>
				Update
			</Button>
		</StackStyled>
	);
}
