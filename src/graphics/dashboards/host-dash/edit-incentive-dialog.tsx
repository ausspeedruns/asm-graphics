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
import { Flag, PieChart } from "@mui/icons-material";

import { GoalEdit } from "./incentive-edits/goal-edit.js";
import { WarEdit } from "./incentive-edits/war-edit.js";

import type { Incentive } from "@asm-graphics/types/Incentives.js";
import styles from "./edit-incentive-dialog.module.css";

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
		<Dialog className={styles.dialogStyled} maxWidth="xl" {...props}>
			<DialogTitle>Edit Incentive</DialogTitle>
			<DialogContent dividers>
				<div className={styles.body}>
					<List className={styles.listStyled} subheader={<li />}>
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
					</List>
					<div className={styles.segment}>
						<h1>{selectedIncentive?.incentive}</h1>
						<h2>{selectedIncentive?.game}</h2>
						<hr />
						{selectedIncentive && getEditComponent(selectedIncentive, updateIncentive)}
					</div>
				</div>
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
		</Dialog>
	);
}
