import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField } from "@mui/material";
import { User } from "@asm-graphics/types/AusSpeedrunsWebsite";
import { useReplicant } from "use-nodecg";
import { HEADSETS } from "./headsets";
import { Commentator } from "@asm-graphics/types/OverlayProps";

const PRONOUN_OPTIONS = ["He/Him", "She/Her", "They/Them", "He/They", "She/They", "They/He", "They/She", "Any/All"];

const HeadsetSelection = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 1rem 0;
`;

const HeadsetButton = styled.button`
	min-height: 4rem;
	border: 0;
	border-radius: 8px;
	font-size: 1.2rem;
	width: 24%;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	open: boolean;
	onClose: () => void;
	runner?: Commentator;
}

export const EditUserDialog = (props: Props) => {
	const [allUsersRep] = useReplicant<User[]>("all-usernames", []);
	const allUsernames = useMemo(() => allUsersRep.map((user) => user.username), [allUsersRep]);

	const [username, setUsername] = useState(props.runner?.name);
	const [oldUsername] = useState(props.runner?.name);
	const [twitch, setTwitch] = useState(props.runner?.twitch);
	const [pronouns, setPronouns] = useState(props.runner?.pronouns);

	function handleNameSelected(name: string | null) {
		if (name === null) return;

		// Find the name that was selected
		const foundUser = allUsersRep.find((user) => user.username === name);

		// Set the pronouns as that name
		if (foundUser) {
			setUsername(foundUser.username);
		}
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
					renderInput={(params) => (
						<TextField
							{...params}
							label="Name"
							InputProps={{ ...params.InputProps, style: { fontSize: "2rem" } }}
						/>
					)}
				/>
				{props.runner?.isRunner && (
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
						renderInput={(params) => (
							<TextField
								{...params}
								label="Pronouns"
								InputProps={{ ...params.InputProps, style: { fontSize: "2rem" } }}
							/>
						)}
					/>
				</div>
				<HeadsetSelection>
					{HEADSETS.map((headset) => {
						if (headset.name === "Host") return <></>;

						return (
							<HeadsetButton
								key={headset.name}
								style={{ backgroundColor: headset.colour, color: headset.textColour }}>
								{headset.name}
							</HeadsetButton>
						);
					})}
				</HeadsetSelection>
			</DialogContent>
			<DialogActions style={{ justifyContent: "space-between" }}>
				<Button onClick={props.onClose}>Cancel</Button>
				<Button onClick={props.onClose} autoFocus variant="outlined">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
