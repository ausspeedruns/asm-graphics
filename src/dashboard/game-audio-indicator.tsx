import { ThemeProvider, FormControlLabel, Radio, Checkbox, FormGroup, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import { darkTheme } from "./theme";

const RadioStyled = styled(Radio)`
	color: #fff !important;
	& .Mui-checked {
		color: #2d4e8a !important;
	}
`;

const AudioControls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 16px;
`;

const GAME_AUDIO_CHANNELS = [
	{
		name: "Game 1",
		channels: [9, 10],
	},
	{
		name: "Game 2",
		channels: [11, 12],
	},
	{
		name: "Game 3",
		channels: [13, 14],
	},
	{
		name: "Game 4",
		channels: [15, 16],
	},
];

export const DashboardGameAudio: React.FC = () => {
	const [manualMode, setManualMode] = useState(false);
	const [gameAudioIndicatorRep] = useReplicant<number>("game-audio-indicator");

	function updateGameAudioIndicator(index?: number) {
		if (typeof index === "undefined") {
			console.error("[GameAudioIndicator] Tried to update an undefined audio indicator");
			return;
		}

		nodecg.sendMessage("changeGameAudio", { manual: manualMode, index: index });
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox checked={manualMode} onChange={(e) => setManualMode(e.target.checked)} />}
					label="Manual Mode"
				/>
			</FormGroup>
			<hr />
			<AudioControls>
				{GAME_AUDIO_CHANNELS.map((gameAudio, i) => {
					return (
						<GameAudioComponent
							channelInfo={gameAudio}
							key={gameAudio.name + i}
							setAudioLive={(checked) => {
								if (checked) {
									updateGameAudioIndicator(i);
								}
							}}
							live={gameAudioIndicatorRep === i}
							index={i}
						/>
					);
				})}
			</AudioControls>
		</ThemeProvider>
	);
};

const GameAudioComponentContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: space-between;
`;

const ChannelName = styled.span`
	font-size: 2rem;
	width: 100px;
	min-width: 100px;
	text-align: right;
`;

interface GameAudioComponentProps {
	channelInfo: (typeof GAME_AUDIO_CHANNELS)[number];
	setAudioLive: (checked: boolean) => void;
	live: boolean;
	index: number;
}

const GameAudioComponent = (props: GameAudioComponentProps) => {
	const [gameAudioNamesRep] = useReplicant<string[]>("game-audio-names");
	const gameAudioNameRep = gameAudioNamesRep?.[props.index] ?? "";

	const [gameAudioName, setGameAudioName] = useState(gameAudioNameRep);
	const [enabled, setEnabled] = useState(Boolean(gameAudioNameRep));

	const isGameAudioNameDifferent = gameAudioNameRep !== gameAudioName;

	const updateGameName = () => {
		nodecg.sendMessage("changeGameAudioName", { name: gameAudioName, index: props.index });
	};

	const disableGameName = () => {
		nodecg.sendMessage("changeGameAudioName", { name: "", index: props.index });
	};

	useEffect(() => {
		setGameAudioName(gameAudioNameRep);
		setEnabled(Boolean(gameAudioNameRep));
	}, [gameAudioNameRep]);

	return (
		<GameAudioComponentContainer>
			<RadioStyled
				style={{ opacity: enabled ? 1 : 0.6 }}
				disabled={!enabled}
				checked={props.live}
				onChange={(_, checked) => props.setAudioLive(checked)}
			/>
			<TextField
				disabled={!enabled}
				value={gameAudioName}
				onChange={(e) => setGameAudioName(e.target.value)}
				label={props.channelInfo.name}
				InputLabelProps={{ shrink: true }}
			/>
			<Button
				variant={isGameAudioNameDifferent ? "contained" : "outlined"}
				disabled={!isGameAudioNameDifferent}
				onClick={updateGameName}
				sx={{ height: 57 }}
			>
				Update
			</Button>
			<Checkbox
				checked={enabled}
				onChange={(_, value) => {
					setEnabled(value);

					if (!value) {
						disableGameName();
					}
				}}
			/>
			<ChannelName style={{ opacity: enabled ? 1 : 0.6 }}>{props.channelInfo.channels.join("/")}</ChannelName>
		</GameAudioComponentContainer>
	);
};

createRoot(document.getElementById("root")!).render(<DashboardGameAudio />);
