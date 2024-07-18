import { useState } from "react";
import { createRoot } from "react-dom/client";
import styled, { css } from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";

import { Commentator } from "@asm-graphics/types/OverlayProps";

import {
	Autocomplete,
	Button,
	IconButton,
	TextField,
	ThemeProvider,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { darkTheme } from "./theme";
import { Headsets } from "../extensions/audio-data";

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

export const DashCouch: React.FC = () => {
	const [name, setName] = useState("");
	const [pronouns, setPronouns] = useState("");
	const [headset, setHeadset] = useState("");
	const [tag, setTag] = useState("");
	const [commentatorsRep] = useReplicant<Commentator[]>("commentators");
	const [hostRep] = useReplicant<Commentator>("host");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const setHost = () => {
		nodecg.sendMessage("update-host", {
			id: "",
			name: name,
			pronouns: pronouns,
			microphone: headset,
			isRunner: false,
			tag: "Host",
		});

		clearData();
	};

	const addCommentator = () => {
		nodecg.sendMessage("update-commentator", {
			id: "",
			name: name,
			pronouns: pronouns,
			microphone: headset,
			isRunner: false,
			tag,
		});

		clearData();
	};

	const clearData = () => {
		setName("");
		setPronouns("");
		setHeadset("None");
		setTag("");
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8 }}>
				<TextfieldStyled fullWidth label="Name" value={name} onChange={handleChange} />
				<Autocomplete
					freeSolo
					options={["He/Him", "She/Her", "They/Them"]}
					renderInput={(params) => <TextField {...params} label="Pronouns" />}
					onInputChange={(_, newInputValue) => {
						setPronouns(newInputValue);
					}}
				/>
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

				<TextfieldStyled fullWidth label="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
				<div style={{ display: "flex", gap: 8 }}>
					<Button
						style={{ flexGrow: 10 }}
						variant="outlined"
						startIcon={<Add />}
						onClick={addCommentator}
						disabled={name === ""}>
						Add Commentator
					</Button>
					<Button onClick={setHost} disabled={name === ""} variant="outlined" style={{ flexGrow: 1 }}>
						Set as Host
					</Button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 5,
						marginTop: 5,
					}}>
					{hostRep && <HostComponent commentator={hostRep} />}
					{commentatorsRep?.map((commentator) => <HostComponent commentator={commentator} />)}
				</div>
			</div>
		</ThemeProvider>
	);
};

const HostComponentContainer = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: space-between;
	background: #4d5e80;
	border-radius: 4px;
	padding: 4px 4px 4px 8px;
`;

const Tag = styled.span`
	font-weight: bold;
`;

const Name = styled.span`
	font-size: 18px;
	line-height: 36px;
	margin-right: 8px;

	display: flex;
	gap: 4px;
`;

const Pronouns = styled.span`
	font-size: 90%;
	font-weight: lighter;
	font-style: italic;
	line-height: 36px;
`;

const Microphone = styled.span`
	font-size: 90%;
	font-weight: lighter;
	font-style: italic;
	line-height: 36px;
`;

interface HostComponentProps {
	commentator: Commentator;
	preview?: boolean;
	inputs?: string[];
}

const HostComponent: React.FC<HostComponentProps> = (props: HostComponentProps) => {
	const removeName = () => {
		nodecg.sendMessage("delete-commentator", props.commentator.id);
	};

	return (
		<HostComponentContainer>
			<Name>
				<Tag>{props.commentator.tag}</Tag>
				{props.commentator.name}
				<Pronouns>{props.commentator.pronouns}</Pronouns>
				{props.commentator.microphone && <Microphone>- Mic: {props.commentator.microphone}</Microphone>}
				
			</Name>

			<IconButton style={{ alignSelf: "flex-end" }} onClick={removeName}>
				<Remove />
			</IconButton>
		</HostComponentContainer>
	);
};

createRoot(document.getElementById("root")!).render(<DashCouch />);
