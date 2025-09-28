import { useMemo, useState } from "react";
import styled from "styled-components";

import { TextField, Button, Autocomplete } from "@mui/material";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { useReplicant } from "@nodecg/react-hooks";
import { useEffect } from "react";
import { User } from "@asm-graphics/types/AusSpeedrunsWebsite";

const HostNameContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8px;
	height: 75%;
	gap: 16px;
`;

interface Props {
	vertical?: boolean;
	className?: string;
	style?: React.CSSProperties;
	updateCb?: (comm: Commentator) => void;
}

export function HostName(props: Props) {
	const [allUsersRep] = useReplicant<User[]>("all-usernames");
	const allUsernames = useMemo(() => (allUsersRep ?? []).map((user) => user.username), [allUsersRep]);
	const [hostName, setHostName] = useState("");
	const [hostPronouns, setHostPronouns] = useState("");
	const [hostRep] = useReplicant<Commentator>("host");

	useEffect(() => {
		setHostName(hostRep?.name ?? "");
		setHostPronouns(hostRep?.pronouns ?? "");
		// setHostDiscord(host?.discordID ?? '');
	}, [hostRep]);

	function handleNameSelected(name: string | null) {
		if (name === null) return;

		// Find the name that was selected
		const foundUser = (allUsersRep ?? []).find((user) => user.username === name);

		// Set the pronouns as that name
		if (foundUser) {
			setHostName(foundUser.username);
			setHostPronouns(foundUser.pronouns ?? "");
		}
	}

	return (
		<HostNameContainer
			className={props.className}
			style={{
				flexDirection: props.vertical ? "column" : undefined,
				...(props.style ?? {}),
			}}>
			<div style={{ display: "flex", gap: 4, flexGrow: 1, padding: "8px 0" }}>
				<Autocomplete
					fullWidth
					freeSolo
					options={allUsernames}
					onChange={(_, newVal) => {
						handleNameSelected(newVal);
					}}
					inputValue={hostName}
					onInputChange={(_, newVal) => setHostName(newVal)}
					renderInput={(params) => (
						<TextField {...params} label="Name" InputProps={{ ...params.InputProps }} />
					)}
				/>
				<TextField
					// style={{ flexShrink: 1 }}
					label="Pronouns"
					value={hostPronouns}
					onChange={(e) => setHostPronouns(e.target.value)}
				/>
			</div>
			<div style={{ display: "flex", flexDirection: props.vertical ? undefined : "column" }}>
				<Button size="small" onClick={() => setHostPronouns("He/Him")}>
					He/Him
				</Button>
				<Button size="small" onClick={() => setHostPronouns("She/Her")}>
					She/Her
				</Button>
				<Button size="small" onClick={() => setHostPronouns("They/Them")}>
					They/Them
				</Button>
			</div>
			<Button
				variant="contained"
				onClick={() => {
					nodecg.sendMessage("update-host", {
						id: "host",
						name: hostName,
						pronouns: hostPronouns,
						microphone: "host",
					});
					props.updateCb?.({
						id: "host",
						name: hostName,
						pronouns: hostPronouns,
						microphone: "host",
					});
				}}>
				Update
			</Button>
		</HostNameContainer>
	);
};
