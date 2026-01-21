import { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	IconButton,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	Divider,
	Typography,
	Box,
	Chip,
	Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, parseISO } from "date-fns";

import type { RunData, RunDataPlayer } from "@asm-graphics/types/RunData";

// Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
function toDateTimeLocal(isoString: string | undefined): string {
	if (!isoString) return "";
	try {
		const date = parseISO(isoString);
		return format(date, "yyyy-MM-dd'T'HH:mm");
	} catch {
		return "";
	}
}

// Convert datetime-local format back to ISO string
function fromDateTimeLocal(dateTimeLocal: string): string {
	if (!dateTimeLocal) return "";
	try {
		// datetime-local gives us YYYY-MM-DDTHH:mm, we need to add seconds
		return new Date(dateTimeLocal).toISOString();
	} catch {
		return "";
	}
}

interface EditRunDialogProps {
	open: boolean;
	onClose: () => void;
	run: RunData | null;
}

export function EditRunDialog(props: EditRunDialogProps) {
	const [mutableRunData, setMutableRunData] = useState<RunData | null>(null);

	// Reset mutable data when the run prop changes or dialog opens
	useEffect(() => {
		if (props.run && props.open) {
			setMutableRunData(JSON.parse(JSON.stringify(props.run)));
		}
	}, [props.run, props.open]);

	if (!props.run || !mutableRunData) {
		return null;
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setMutableRunData((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				[name]: value,
			};
		});
	}

	function handleCustomDataChange(key: string, value: string) {
		setMutableRunData((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				customData: {
					...prev.customData,
					[key]: value,
				},
			};
		});
	}

	function handleDeleteRunner(teamIndex: number, playerIndex: number) {
		setMutableRunData((prev) => {
			if (!prev) return prev;
			const newTeams = [...prev.teams];
			const team = newTeams[teamIndex];
			if (!team) return prev;
			const newPlayers = [...team.players];
			newPlayers.splice(playerIndex, 1);
			newTeams[teamIndex] = {
				...team,
				players: newPlayers,
			};
			// Remove empty teams
			const filteredTeams = newTeams.filter((t) => t.players.length > 0);
			return {
				...prev,
				teams: filteredTeams,
			};
		});
	}

	function handleAddRunner(runnerName: string) {
		if (!runnerName.trim()) return;

		setMutableRunData((prev) => {
			if (!prev) return prev;

			const newTeamId = crypto.randomUUID();
			const newPlayer: RunDataPlayer = {
				name: runnerName.trim(),
				id: crypto.randomUUID(),
				teamID: prev.teams[0]?.id ?? newTeamId,
				social: {},
				customData: {},
			};

			// Add to first team, or create a new team if none exist
			if (prev.teams.length === 0 || !prev.teams[0]) {
				return {
					...prev,
					teams: [
						{
							id: newTeamId,
							players: [newPlayer],
						},
					],
				};
			}

			const firstTeam = prev.teams[0];
			const newTeams = [...prev.teams];
			newTeams[0] = {
				id: firstTeam.id,
				name: firstTeam.name,
				relayPlayerID: firstTeam.relayPlayerID,
				players: [...firstTeam.players, newPlayer],
			};
			return {
				...prev,
				teams: newTeams,
			};
		});
	}

	function handleClose() {
		props.onClose();
	}

	function handleSave() {
		if (!mutableRunData) return;

		console.log("Saving run data:", mutableRunData);
		nodecg.sendMessageToBundle("modifyRun", "nodecg-speedcontrol", { runData: mutableRunData });
		props.onClose();
	}

	const hasUpdatedValues = JSON.stringify(mutableRunData) !== JSON.stringify(props.run);

	const allPlayers = mutableRunData.teams.flatMap((team, teamIndex) =>
		team.players.map((player, playerIndex) => ({
			player,
			teamIndex,
			playerIndex,
			teamName: team.name,
		})),
	);

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md" style={{ colorScheme: "dark" }}>
			<DialogTitle>
				Edit Run
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{/* Game Information Section */}
					<Typography variant="subtitle2" sx={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
						Game Information
					</Typography>

					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label="Game Name"
							name="game"
							value={mutableRunData.game ?? ""}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							label="Display Game Name"
							value={mutableRunData.customData["gameDisplay"] ?? ""}
							onChange={(e) => handleCustomDataChange("gameDisplay", e.target.value)}
							helperText="Use for multi-line display (add \n for line breaks)"
						/>
					</Box>

					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label="Category"
							name="category"
							value={mutableRunData.category ?? ""}
							onChange={handleChange}
						/>
						<TextField
							label="Estimate"
							name="estimate"
							value={mutableRunData.estimate ?? ""}
							onChange={handleChange}
							placeholder="HH:MM:SS"
							sx={{ minWidth: 150 }}
						/>
						<TextField
							label="Release Year"
							name="release"
							value={mutableRunData.release ?? ""}
							onChange={handleChange}
							sx={{ minWidth: 120 }}
						/>
					</Box>

					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label="System (Display)"
							name="system"
							value={mutableRunData.system ?? ""}
							onChange={handleChange}
							helperText="Shown on stream"
						/>
						<TextField
							fullWidth
							label="Tech Platform"
							value={mutableRunData.customData["techPlatform"] ?? ""}
							onChange={(e) => handleCustomDataChange("techPlatform", e.target.value)}
							helperText="Used for tech setup"
						/>
					</Box>

					<Divider sx={{ my: 1 }} />

					{/* Schedule Section */}
					<Typography variant="subtitle2" sx={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
						Schedule
					</Typography>

					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							label="Scheduled Time"
							type="datetime-local"
							value={toDateTimeLocal(mutableRunData.scheduled)}
							onChange={(e) => {
								const isoValue = fromDateTimeLocal(e.target.value);
								setMutableRunData((prev) => {
									if (!prev) return prev;
									return {
										...prev,
										scheduled: isoValue,
										scheduledS: isoValue
											? Math.floor(new Date(isoValue).getTime() / 1000)
											: undefined,
									};
								});
							}}
							slotProps={{ inputLabel: { shrink: true } }}
						/>
						<TextField
							label="Setup Time"
							name="setupTime"
							value={mutableRunData.setupTime ?? ""}
							onChange={handleChange}
							placeholder="MM:SS"
							sx={{ minWidth: 150 }}
						/>
					</Box>

					<Divider sx={{ my: 1 }} />

					{/* Runners Section */}
					<Typography variant="subtitle2" sx={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
						Runners ({allPlayers.length})
					</Typography>

					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
						{allPlayers.map(({ player, teamIndex, playerIndex, teamName }) => (
							<Chip
								key={player.id}
								label={
									<>
										{player.name}
										{player.pronouns && ` (${player.pronouns})`}
										{teamName && ` — ${teamName}`}
									</>
								}
								onDelete={() => handleDeleteRunner(teamIndex, playerIndex)}
								deleteIcon={<DeleteIcon />}
								sx={{ height: "auto", py: 0.5 }}
							/>
						))}
						{allPlayers.length === 0 && (
							<Typography sx={{ opacity: 0.5, fontStyle: "italic" }}>No runners assigned</Typography>
						)}
					</Box>

					<Autocomplete
						freeSolo
						options={[]}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Add Runner"
								placeholder="Type name and press Enter"
								size="small"
							/>
						)}
						onChange={(_, value) => {
							if (typeof value === "string") {
								handleAddRunner(value);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								const input = e.target as HTMLInputElement;
								handleAddRunner(input.value);
								input.value = "";
							}
						}}
						sx={{ maxWidth: 300 }}
					/>

					<Divider sx={{ my: 1 }} />

					{/* Special Requirements Section */}
					<Typography variant="subtitle2" sx={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>
						Special Requirements
					</Typography>

					<TextField
						fullWidth
						multiline
						minRows={3}
						label="Special Requirements"
						value={mutableRunData.customData["specialRequirements"] ?? ""}
						onChange={(e) => handleCustomDataChange("specialRequirements", e.target.value)}
						helperText="Include LAYOUT: prefix for layout requirements"
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Typography variant="caption" sx={{ opacity: 0.5, mr: "auto", ml: 1 }}>
					ID: {mutableRunData.id}
				</Typography>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={!hasUpdatedValues} variant="contained" color="success">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
