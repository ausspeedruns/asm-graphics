import { Autocomplete, Button, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import styled, { css } from "styled-components";
import { Headsets } from "../extensions/audio-data";
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { darkTheme } from "./theme";
import { NodeCGAPIClient } from "nodecg/out/client/api/api.client";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { useReplicant } from "@nodecg/react-hooks";
import { User } from "@asm-graphics/types/AusSpeedrunsWebsite";
import { Delete } from "@mui/icons-material";

const CouchEditDialogContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const TextfieldStyled = styled(TextField)`
	margin-bottom: 6px !important;

	& .Mui-focused {
		color: #a8bde3 !important;
	}

	& .MuiInput-underline:after {
		border-bottom: 2px solid #a8bde3 !important;
	}

	& .MuiInputBase-input {
		color: #ffffff !important;
	}
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

const Heading = styled.h1`
	margin: 0;
`;

const Id = styled.span`
	font-size: 12px;
	opacity: 0.5;
`;

export namespace CouchEditDialog {
	export interface Dialog extends Window {
		openDialog: (opts: { data: Commentator }) => void;
	}
}

function CouchEditDialog() {
	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [pronouns, setPronouns] = useState("");
	const [headset, setHeadset] = useState("");
	const [tag, setTag] = useState("");
	const [dialog, setDialog] = useState<ReturnType<NodeCGAPIClient["getDialog"]>>();
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

	useEffect(() => {
		setDialog(nodecg.getDialog("commentator-edit-dialog"));
	}, []);

	(window as unknown as CouchEditDialog.Dialog).openDialog = ({ data }) => {
		dialog?.open();
		setId(data.id);
		setName(data.name);
		setPronouns(data.pronouns ?? "");
		setHeadset(data.microphone ?? "");
		setTag(data.tag ?? "");
	};

	function setHost() {
		setTag("Host");
		// nodecg.sendMessage("update-host", {
		// 	id: "",
		// 	name: name,
		// 	pronouns: pronouns,
		// 	microphone: headset,
		// 	isRunner: false,
		// 	tag: "Host",
		// });
	}

	function editCommentator() {
		nodecg.sendMessage(tag === "Host" ? "update-host" : "update-commentator", {
			id: id,
			name: name,
			pronouns: pronouns,
			microphone: headset,
			isRunner: false,
			tag,
		});
		close(true);
	}

	function deleteCommentator() {
		nodecg.sendMessage("delete-commentator", id);
		close(true);
	}

	function close(confirm = false) {
		(dialog as any)._updateClosingReasonConfirmed(confirm);
		dialog?.close();
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<CouchEditDialogContainer>
				<Heading>{id ? `Editing ${name}` : "Add Commentator"}</Heading>
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
						style={{ flexWrap: "wrap" }}>
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
					<TextfieldStyled fullWidth label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
					<Button onClick={setHost} disabled={name === ""} variant="outlined" style={{ flexGrow: 1 }}>
						Set as Host
					</Button>
				</div>

				<div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
					{id && (
						<Button variant="contained" color="error" onClick={deleteCommentator} startIcon={<Delete />}>
							Delete
						</Button>
					)}
					<div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexGrow: 1 }}>
						<Button variant="contained" color="success" onClick={editCommentator}>
							{id ? "Update" : "Add"}
						</Button>
						<Button variant="outlined" onClick={() => close(false)}>
							Close
						</Button>
					</div>
				</div>
			</CouchEditDialogContainer>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<CouchEditDialog />);
