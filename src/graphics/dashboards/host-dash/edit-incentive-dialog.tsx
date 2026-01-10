import { useState } from "react";
import {
	Alert,
	Dialog,
	DialogContent,
	DialogTitle,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Snackbar,
	type DialogProps,
} from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import styled from "@emotion/styled";
import { Flag, PieChart } from "@mui/icons-material";

import { GoalEdit } from "./incentive-edits/goal-edit";
import { WarEdit } from "./incentive-edits/war-edit";

import type { Incentive } from "@asm-graphics/types/Incentives";

const Body = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 4fr;
	gap: 1rem;
`;

const Segment = styled.div`
	border-radius: 8px;
	padding: 1rem;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);

	display: flex;
	flex-direction: column;
	align-items: center;

	& > h1 {
		font-size: 2rem;
		margin-bottom: 0;
	}

	& > h2 {
		font-size: 1.5rem;
		margin-top: 0;
		font-style: italic;
	}

	& > hr {
		width: 80%;
		border: none;
		border-top: 1px solid rgba(0, 0, 0, 0.6);
	}
`;

const ListStyled = styled(List)`
	overflow-y: auto;
	max-height: 87vh;
	border-radius: 8px;
	padding: 1rem;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);

	--sb-track-color: #fff;
	--sb-thumb-color: #a9a9a9;
	--sb-size: 10px;

	&::-webkit-scrollbar {
		width: var(--sb-size);
	}

	&::-webkit-scrollbar-track {
		background: var(--sb-track-color);
		border-radius: 8px;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--sb-thumb-color);
		border-radius: 8px;
		border: 2px solid #fff;
	}

	@supports not selector(::-webkit-scrollbar) {
		scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
	}
`;

const DialogStyled = styled(Dialog)`
	font-family: "Roboto", sans-serif;

	.MuiDialog-paper {
	}
`;

function getEditComponent(incentive: Incentive, updateIncentive: (incentive: Incentive) => void) {
	if (incentive.type === "Goal") {
		return <GoalEdit key={incentive.id} incentive={incentive} updateIncentive={updateIncentive} />;
	}

	if (incentive.type === "War") {
		return <WarEdit key={incentive.id} incentive={incentive} updateIncentive={updateIncentive} />;
	}

	return null;
}

export function EditIncentiveDialog(props: DialogProps) {
	const [incentivesRep] = useReplicant("incentives");
	const [selectedIncentiveId, setSelectedIncentiveId] = useState(incentivesRep?.[0]?.id);
	const [incentiveUpdated, setIncentiveUpdated] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

	const selectedIncentive = incentivesRep?.find((incentive) => incentive.id === selectedIncentiveId);

	const remappedIncentives = incentivesRep?.reduce(
		(acc, incentive) => {
			const gameName = incentive.game;
			const existingGame = acc.find((item) => item.gameName === gameName);

			if (existingGame) {
				existingGame.incentives.push(incentive);
			} else {
				acc.push({ gameName, incentives: [incentive] });
			}

			return acc;
		},
		[] as { gameName: string; incentives: Incentive[] }[],
	);

	function updateIncentive(data: Incentive) {
		nodecg
			.sendMessage("updateIncentive", data)
			.then(() => {
				setSnackbarSeverity("success");
				setIncentiveUpdated("Incentive updated!");
			})
			.catch((error) => {
				console.error(error);
				setSnackbarSeverity("error");
				setIncentiveUpdated(`Error updating incentive: ${error}`);
			});
	}

	function closeSnackbar() {
		setIncentiveUpdated("");
	}

	return (
		<DialogStyled maxWidth="xl" {...props}>
			<DialogTitle>Edit Incentive</DialogTitle>
			<DialogContent dividers>
				<Body>
					<ListStyled subheader={<li />}>
						{remappedIncentives?.map((game) => (
							<li key={`section-${game.gameName}`}>
								<ul style={{ padding: 0 }}>
									<ListSubheader
										sx={{ margin: "1rem 0 0 0", fontSize: "125%", lineHeight: "normal" }}
									>
										{game.gameName}
									</ListSubheader>
									{game.incentives.map((incentive) => (
										<ListItemButton
											selected={selectedIncentiveId === incentive.id}
											onClick={() => {
												setSelectedIncentiveId(incentive.id);
											}}
											key={incentive.id}
										>
											<ListItemIcon>
												{incentive.type === "Goal" ? <Flag /> : <PieChart />}
											</ListItemIcon>
											<ListItemText
												primary={incentive.incentive}
												secondary={incentive.active ? "Active" : "Inactive"}
											/>
										</ListItemButton>
									))}
								</ul>
							</li>
						))}
					</ListStyled>
					<Segment>
						<h1>{selectedIncentive?.incentive}</h1>
						<h2>{selectedIncentive?.game}</h2>
						<hr />
						{selectedIncentive && getEditComponent(selectedIncentive, updateIncentive)}
					</Segment>
				</Body>
			</DialogContent>

			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={incentiveUpdated !== ""}
				onClose={closeSnackbar}
				autoHideDuration={5000}
			>
				<Alert onClose={closeSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
					{incentiveUpdated}
				</Alert>
			</Snackbar>
		</DialogStyled>
	);
}
