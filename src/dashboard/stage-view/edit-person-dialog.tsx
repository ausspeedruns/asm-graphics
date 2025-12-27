import { useState } from "react";
import {
	Dialog,
	DialogTitle,
	IconButton,
	DialogContent,
	TextField,
	Autocomplete,
	ToggleButtonGroup,
	ToggleButton,
	DialogActions,
	Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Headsets } from "../../shared/audio-data";

import type { RunDataPlayer } from "@asm-graphics/types/RunData";

interface EditRunnerDialogProps {
	runner?: RunDataPlayer;
	open: boolean;
	onClose: () => void;
}

export function EditRunnerDialog(props: EditRunnerDialogProps) {
	if (!props.runner) {
		return null;
	}

	const [runnerData, setRunnerData] = useState<RunDataPlayer>({
		...props.runner,
	});

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setRunnerData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleSocialChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setRunnerData((prev) => ({
			...prev,
			social: {
				...prev.social,
				[name]: value,
			},
		}));
	}

	function handleMicrophoneChange(microphone: string | undefined) {
		setRunnerData((prev) => ({
			...prev,
			customData: {
				...prev.customData,
				microphone: microphone ?? "",
			},
		}));
	}

	function handlePronounChange(pronouns: string) {
		setRunnerData((prev) => ({
			...prev,
			pronouns: pronouns,
		}));
	}

	const handleClose = () => {
		props.onClose();
	};

	const handleSave = () => {
		console.log("Saving runner data:", runnerData);
		props.onClose();
	};

	const hasUpdatedValues =
		runnerData.name !== props.runner.name ||
		runnerData.pronouns !== props.runner.pronouns ||
		runnerData.social?.twitch !== props.runner.social?.twitch ||
		runnerData.customData?.microphone !== props.runner.customData?.microphone;

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md" style={{ colorScheme: "dark" }}>
			<DialogTitle>
				Edit Runner
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
			<DialogContent>
				<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					<div style={{ display: "flex", gap: 16 }}>
						<TextField fullWidth label="Name" name="name" value={runnerData.name} onChange={handleChange} />
						<Autocomplete
							freeSolo
							options={["He/Him", "She/Her", "They/Them"]}
							renderInput={(params) => <TextField {...params} label="Pronouns" />}
							onInputChange={(_, newInputValue) => {
								handlePronounChange(newInputValue);
							}}
							inputValue={runnerData.pronouns}
							sx={{ minWidth: "30%" }}
						/>
					</div>
					<div>
						<TextField
							fullWidth
							label="Twitch"
							name="twitch"
							value={runnerData.social?.twitch || ""}
							onChange={handleSocialChange}
						/>
					</div>
					<div>
						<span style={{ display: "block" }}>Headset</span>
						<ToggleButtonGroup
							value={props.runner.customData?.microphone}
							onChange={(_, headset) => handleMicrophoneChange(headset)}
							exclusive
							style={{ flexWrap: "wrap" }}
						>
							{Headsets.map((headset) => {
								return (
									<ToggleButton value={headset.name} key={headset.name}>
										{headset.name}
									</ToggleButton>
								);
							})}
						</ToggleButtonGroup>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={!hasUpdatedValues} variant="contained" color="success">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}
