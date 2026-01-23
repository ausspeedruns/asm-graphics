import { useMemo, useState } from "react";
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
import { useReplicant } from "@nodecg/react-hooks";

const defaultPersonData: RunDataPlayer = {
	id: "",
	name: "",
	pronouns: "",
	teamID: "",
	social: {
		twitch: "",
	},
	customData: {
		microphone: "",
		tag: "",
	},
};

export const NEW_COMMENTATOR_ID = "new-commentator";
export const NEW_RUNNER_ID = "new-runner";

const PRONOUN_OPTIONS = ["He/Him", "She/Her", "They/Them", "He/They", "She/They", "They/He", "They/She", "Any/All"];

interface EditRunnerDialogProps {
	open: boolean;
	onClose: () => void;
	personId: string | null;
}

export function EditPersonDialog(props: EditRunnerDialogProps) {
	if (!props.personId) {
		return null;
	}

	const [allUsersRep] = useReplicant("all-usernames");
	const allUsernames = useMemo(() => (allUsersRep ?? []).map((user) => user.username), [allUsersRep]);

	const person =
		props.personId === NEW_COMMENTATOR_ID || props.personId === NEW_RUNNER_ID
			? defaultPersonData
			: usePersonData(props.personId);

	console.log("Editing person:", person, props.personId);

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

	function handleNameChange(username: string) {
		// Find the user in allUsersRep
		const selectedUser = allUsersRep?.find((user) => user.username === username);
		
		if (selectedUser) {
			// Auto-fill the details from the selected user
			setMutablePersonData((prev) => ({
				...prev,
				name: selectedUser.username,
				pronouns: selectedUser.pronouns || prev.pronouns,
				social: {
					...prev.social,
					twitch: selectedUser.twitch || prev.social?.twitch || "",
				},
			}));
		} else {
			// Just update the name if no user found (custom input)
			setMutablePersonData((prev) => ({
				...prev,
				name: username,
			}));
		}
	}

	function handleClose() {
		props.onClose();
	}

	function handleSave() {
		console.log("Saving person data:", mutablePersonData);
		if (props.personId === NEW_RUNNER_ID) {
			void nodecg.sendMessage("speedcontrol:newRunner", {
				runId: "", // Empty string indicates active run
				runner: mutablePersonData,
			});
		} else {
			void nodecg.sendMessage("update-commentator", {
				id: mutablePersonData.id,
				name: mutablePersonData.name,
				pronouns: mutablePersonData.pronouns,
				twitch: mutablePersonData.social?.twitch,
				tag: mutablePersonData.customData?.tag,
				microphone: mutablePersonData.customData?.microphone,
			});
		}
		props.onClose();
	}

	console.log(mutablePersonData, originalPerson);

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
						<Autocomplete
							freeSolo
							fullWidth
							options={allUsernames}
							renderInput={(params) => <TextField {...params} label="Name" />}
							onInputChange={(_, newInputValue) => {
								handleNameChange(newInputValue);
							}}
							inputValue={mutablePersonData.name}
						/>
						<Autocomplete
							freeSolo
							options={PRONOUN_OPTIONS}
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
