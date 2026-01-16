import { useMemo, useState } from "react";
import styled from "@emotion/styled";

import { TextField, Button, Autocomplete } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { useEffect } from "react";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";
import { HOST_TAG } from "@asm-graphics/shared/constants";

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
	updateCb?: (comm: { id: string; name: string; pronouns?: string }) => void;
}

export function HostName(props: Props) {
	const [allUsersRep] = useReplicant("all-usernames");
	const [commentatorsRep] = useReplicant("commentators");
	const allUsernames = useMemo(() => (allUsersRep ?? []).map((user) => user.username), [allUsersRep]);
	const [hostName, setHostName] = useState("");
	const [hostPronouns, setHostPronouns] = useState("");
	const [hostId, setHostId] = useState("");

	useEffect(() => {
		const host = (commentatorsRep ?? []).find((comm) => comm.customData["tag"] === HOST_TAG);
		setHostName(host?.name ?? "");
		setHostPronouns(host?.pronouns ?? "");
		setHostId(host?.id ?? "");
	}, [commentatorsRep]);

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

	function handleSubmit() {
		void nodecg.sendMessage("update-commentator", {
			id: hostId,
			name: hostName,
			pronouns: hostPronouns,
			tag: HOST_TAG,
		});

		props.updateCb?.({
			id: hostId,
			name: hostName,
			pronouns: hostPronouns,
		});
	}

	return (
		<HostNameContainer
			className={props.className}
			style={{
				flexDirection: props.vertical ? "column" : undefined,
				...props.style,
			}}
		>
			<div style={{ display: "flex", gap: 4, flexGrow: 1, padding: "8px 0", width: "100%" }}>
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
				<Autocomplete
					freeSolo
					options={["He/Him", "She/Her", "They/Them"]}
					renderInput={(params) => <TextField {...params} label="Pronouns" />}
					onInputChange={(_, newInputValue) => {
						setHostPronouns(newInputValue);
					}}
					inputValue={hostPronouns}
					sx={{ minWidth: "30%" }}
				/>
			</div>
			<Button variant="contained" onClick={handleSubmit}>
				Update
			</Button>
		</HostNameContainer>
	);
}
