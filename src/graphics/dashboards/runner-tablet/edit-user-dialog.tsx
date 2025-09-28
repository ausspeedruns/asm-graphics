import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import type { User } from "@asm-graphics/types/AusSpeedrunsWebsite";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import { Headsets } from "../../../extensions/audio-data";

const PRONOUN_OPTIONS = ["He/Him", "She/Her", "They/Them", "He/They", "She/They", "They/He", "They/She", "Any/All"];

const HeadsetSelection = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
	margin-top: 0.5rem;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
`;

const HeadsetButton = styled.button`
	min-height: 4rem;
	border: 0;
	border-radius: 8px;
	font-size: 1.2rem;
	width: 23%;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	open: boolean;
	onClose: () => void;
	commentator?: Commentator;
}

export const EditUserDialog = (props: Props) => {
	const [allUsersRep] = useReplicant<User[]>("all-usernames");
	const allUsernames = useMemo(() => (allUsersRep ?? []).map((user) => user.username), [allUsersRep]);

	const [id, setID] = useState("");
	const [username, setUsername] = useState("");
	const [oldUsername, setOldUsername] = useState("");
	const [twitch, setTwitch] = useState("");
	const [pronouns, setPronouns] = useState("");
	const [microphone, setMicrophone] = useState("NONE");

	useEffect(() => {
		setID(props.commentator?.id ?? "");
		setUsername(props.commentator?.name ?? "");
		setOldUsername(props.commentator?.name ?? "");
		setTwitch(props.commentator?.twitch ?? "");
		setPronouns(props.commentator?.pronouns ?? "");
		setMicrophone(props.commentator?.microphone ?? "NONE");
	}, [props.commentator]);

	function handleNameSelected(name: string | null) {
		if (name === null || !allUsersRep) return;

		// Find the name that was selected
		const foundUser = allUsersRep.find((user) => user.username === name);

		// Set the pronouns as that name
		if (foundUser) {
			setUsername(foundUser.username);
			setPronouns(foundUser.pronouns ?? "");
			setTwitch(foundUser.twitch ?? "");
		}

		// nameAutocorrect.current.
	}

	function handleSave() {
		// Update commentator information
		nodecg.sendMessage("update-commentator", {
			id: id,
			name: username,
			pronouns: pronouns,
			microphone: microphone,
			isRunner: props.commentator?.isRunner,
			teamId: props.commentator?.teamId,
			twitch: twitch,
		});

		props.onClose();
	}

	function handleDelete() {
		if (!props.commentator) return;
		if (props.commentator.isRunner) return;
		if (!props.commentator.id) return;

		nodecg.sendMessage("delete-commentator", props.commentator.id);
		props.onClose();
	}

	return (
		<Dialog
			open={props.open}
			onClose={props.onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle id="alert-dialog-title">{oldUsername ? `Edit ${oldUsername}` : "Add Commentator"}</DialogTitle>
			<DialogContent style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				<Autocomplete
					style={{
						fontSize: "2rem !important",
					}}
					freeSolo
					options={allUsernames}
					onChange={(_, newVal) => {
						handleNameSelected(newVal);
					}}
					inputValue={username}
					onInputChange={(_, newVal) => setUsername(newVal)}
					blurOnSelect={true}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Name"
							InputProps={{ ...params.InputProps, style: { fontSize: "2rem" } }}
						/>
					)}
				/>
				{props.commentator?.isRunner && (
					<TextField
						fullWidth
						style={{ fontSize: "2rem !important" }}
						value={twitch}
						onChange={(e) => {
							setTwitch(e.target.value);
						}}
						label="Runner Twitch"
						InputProps={{ style: { fontSize: "2rem" } }}
					/>
				)}
				<div style={{ display: "flex" }}>
					<div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
						<button onClick={() => setPronouns("He/Him")}>He/Him</button>
						<button onClick={() => setPronouns("She/Her")}>She/Her</button>
						<button onClick={() => setPronouns("They/Them")}>They/Them</button>
						<button onClick={() => setPronouns("")}>None</button>
					</div>
					<Autocomplete
						style={{ flexGrow: 1, fontSize: "2rem" }}
						freeSolo
						options={PRONOUN_OPTIONS}
						inputValue={pronouns}
						onInputChange={(_, newVal) => setPronouns(newVal)}
						blurOnSelect={true}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Pronouns"
								InputProps={{ ...params.InputProps, style: { fontSize: "2rem" } }}
							/>
						)}
					/>
				</div>
				<div>
					<span style={{ fontWeight: "bold", fontFamily: "sans-serif" }}>Headset / Microphone</span>
					<HeadsetSelection>
						{Headsets.map((headset) => {
							if (headset.name === "Host") return <></>;

							return (
								<HeadsetButton
									key={headset.name}
									style={{
										backgroundColor: headset.colour,
										color: headset.textColour,
										boxShadow:
											microphone === headset.name
												? `0 0 0 5px ${headset.textColour}, 0 0 0 10px ${headset.colour}`
												: "",
										width: headset.name === "NONE" ? "15%" : "",
									}}
									onClick={() => setMicrophone(headset.name)}>
									{headset.name}
								</HeadsetButton>
							);
						})}
					</HeadsetSelection>
				</div>
			</DialogContent>
			<DialogActions style={{ justifyContent: "space-between" }}>
				<Button onClick={props.onClose}>Cancel</Button>
				{!props.commentator?.isRunner && props.commentator?.id && (
					<Button variant="outlined" onClick={handleDelete}>
						Delete
					</Button>
				)}
				<Button onClick={handleSave} variant="contained" disabled={!username}>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
