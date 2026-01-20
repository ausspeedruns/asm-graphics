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
import { usePersonData } from "./use-person-data";

interface EditRunnerDialogProps {
	open: boolean;
	onClose: () => void;
	personId: string | null;
}

export function EditPersonDialog(props: EditRunnerDialogProps) {
	if (!props.personId) {
		return null;
	}

	const person = usePersonData(props.personId);

	const [originalPerson] = useState<RunDataPlayer | undefined>(person);
	const [mutablePersonData, setMutablePersonData] = useState<RunDataPlayer>(JSON.parse(JSON.stringify(person ?? {})));

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setMutablePersonData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleSocialChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setMutablePersonData((prev) => ({
			...prev,
			social: {
				...prev.social,
				[name]: value,
			},
		}));
	}

	function handleCustomDataChange(key: string, value: string | undefined) {
		setMutablePersonData((prev) => ({
			...prev,
			customData: {
				...prev.customData,
				[key]: value ?? "",
			},
		}));
	}

	function handlePronounChange(pronouns: string) {
		setMutablePersonData((prev) => ({
			...prev,
			pronouns: pronouns,
		}));
	}

	function handleClose() {
		props.onClose();
	}

	function handleSave() {
		console.log("Saving person data:", mutablePersonData);
		nodecg.sendMessage("update-commentator", {
			id: mutablePersonData.id,
			name: mutablePersonData.name,
			pronouns: mutablePersonData.pronouns,
			twitch: mutablePersonData.social?.twitch,
			tag: mutablePersonData.customData?.tag,
			microphone: mutablePersonData.customData?.microphone,
		});
		props.onClose();
	}

	const hasUpdatedValues =
		mutablePersonData.name !== originalPerson?.name ||
		mutablePersonData.pronouns !== originalPerson?.pronouns ||
		mutablePersonData.social?.twitch !== originalPerson?.social?.twitch ||
		mutablePersonData.customData?.microphone !== originalPerson?.customData?.microphone ||
		mutablePersonData.customData?.tag !== originalPerson?.customData?.tag;

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md" style={{ colorScheme: "dark" }}>
			<DialogTitle>
				Edit Person
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
						<TextField
							fullWidth
							label="Name"
							name="name"
							value={mutablePersonData.name}
							onChange={handleChange}
						/>
						<Autocomplete
							freeSolo
							options={["He/Him", "She/Her", "They/Them"]}
							renderInput={(params) => <TextField {...params} label="Pronouns" />}
							onInputChange={(_, newInputValue) => {
								handlePronounChange(newInputValue);
							}}
							inputValue={mutablePersonData.pronouns}
							sx={{ minWidth: "30%" }}
						/>
					</div>
					<div style={{ display: "flex", gap: 16 }}>
						<TextField
							fullWidth
							label="Twitch"
							name="twitch"
							value={mutablePersonData.social?.twitch ?? ""}
							onChange={handleSocialChange}
						/>
						<TextField
							fullWidth
							label="Tag"
							name="tag"
							value={mutablePersonData.customData["tag"] ?? ""}
							onChange={(event) => handleCustomDataChange("tag", event.target.value)}
						/>
					</div>
					<div>
						<span style={{ display: "block" }}>Headset</span>
						<ToggleButtonGroup
							value={mutablePersonData.customData?.microphone}
							onChange={(_, headset) => handleCustomDataChange("microphone", headset)}
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
