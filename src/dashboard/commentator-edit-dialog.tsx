import {
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	useColorScheme,
} from "@mui/material";
import styled, { css } from "styled-components";
import { Headsets } from "../extensions/audio-data";
import { useMemo, useState } from "react";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { useReplicant } from "@nodecg/react-hooks";
import { User } from "@asm-graphics/types/AusSpeedrunsWebsite";
import { Delete } from "@mui/icons-material";

const CouchEditDialogContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const HeadsetToggleButton = styled(ToggleButton)<{ $outline?: string }>`
	&.MuiToggleButton-root:hover {
		${(props) =>
			props.$outline &&
			css`
				background-color: ${props.$outline}0A;
			`}
	}
`;

const Id = styled.div`
	font-size: 12px;
	opacity: 0.5;
`;

export namespace CouchEditDialog {
	export interface Dialog extends Window {
		openDialog: (opts: { data: Commentator }) => void;
	}
}

interface CouchEditDialogProps {
	person?: Commentator;
	open: boolean;
	onClose: () => void;
}

export function CouchEditDialog(props: CouchEditDialogProps) {
	console.log(props.person)
	const { mode } = useColorScheme();
	const [name, setName] = useState(props.person?.name ?? "");
	const [pronouns, setPronouns] = useState(props.person?.pronouns ?? "");
	const [headset, setHeadset] = useState(props.person?.microphone ?? "");
	const [tag, setTag] = useState(props.person?.tag ?? "");
	const [allUsersRep] = useReplicant<User[]>("all-usernames");
	const allUsernames = useMemo(() => (allUsersRep ?? []).map((user) => user.username), [allUsersRep]);

	function handleNameSelected(name: string | null) {
		if (name === null) return;

		// Find the name that was selected
		const foundUser = (allUsersRep ?? []).find((user) => user.username === name);

		// Set the pronouns as that name
		if (foundUser) {
			setName(foundUser.username);
			setPronouns(foundUser.pronouns ?? "");
		}
	}

	// function setHost() {
	// 	setTag("Host");
	// }

	const hasUpdatedValues =
		name !== (props.person?.name ?? "") ||
		pronouns !== (props.person?.pronouns ?? "") ||
		headset !== (props.person?.microphone ?? "") ||
		tag !== (props.person?.tag ?? "");

	function editCommentator() {
		nodecg.sendMessage(tag === "Host" ? "update-host" : "update-commentator", {
			id: id,
			name: name,
			pronouns: pronouns,
			microphone: headset,
			isRunner: false,
			tag,
		});
		handleClose();
	}

	function deleteCommentator() {
		nodecg.sendMessage("delete-commentator", id);
		handleClose();
	}

	function handleClose() {
		props.onClose();
	}

	const id = props.person?.id ?? "";

	return (
		<Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md" style={{ colorScheme: mode }}>
			<DialogTitle>{id ? `Editing ${name}` : "Add Commentator"}</DialogTitle>
			<DialogContent dividers style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
				{id && <Id>{id}</Id>}

				<div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
					<Autocomplete
						freeSolo
						options={allUsernames}
						onChange={(_, newVal) => {
							handleNameSelected(newVal);
						}}
						inputValue={name}
						onInputChange={(_, newVal) => setName(newVal)}
						renderInput={(params) => (
							<TextField {...params} label="Name" InputProps={{ ...params.InputProps }} />
						)}
					/>
					<Autocomplete
						freeSolo
						options={["He/Him", "She/Her", "They/Them"]}
						renderInput={(params) => <TextField {...params} label="Pronouns" />}
						onInputChange={(_, newInputValue) => {
							setPronouns(newInputValue);
						}}
						inputValue={pronouns}
					/>
				</div>
				<div>
					<span style={{ display: "block" }}>Headset</span>
					<ToggleButtonGroup
						value={headset}
						onChange={(_, headset) => setHeadset(headset)}
						exclusive
						style={{ flexWrap: "wrap" }}
					>
						{Headsets.map((headset) => {
							return (
								<HeadsetToggleButton value={headset.name} key={headset.name}>
									{headset.name}
								</HeadsetToggleButton>
							);
						})}
					</ToggleButtonGroup>
				</div>

				<div style={{ display: "flex", gap: 8 }}>
					<TextField fullWidth label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
				</div>
			</DialogContent>
			<DialogActions>
				{id && (
					<Button variant="contained" color="error" onClick={deleteCommentator} startIcon={<Delete />}>
						Delete
					</Button>
				)}
				<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexGrow: 1 }}>
					<Button variant="contained" color="success" disabled={!hasUpdatedValues} onClick={editCommentator}>
						{id ? "Update" : "Add"}
					</Button>
					<Button variant="outlined" onClick={handleClose}>
						Close
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	);
}
