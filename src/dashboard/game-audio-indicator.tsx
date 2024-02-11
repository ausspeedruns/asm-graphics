import { RunData } from "@asm-graphics/types/RunData";
import { ThemeProvider, FormControlLabel, Radio, Checkbox, FormGroup, TextField } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";
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

interface ZippedRunnerAudio {
	audioInfo: (typeof GAME_AUDIO_CHANNELS)[number];
	runner?: {
		id: string;
		name: string;
	};
}

export const DashboardGameAudio: React.FC = () => {
	const [manualMode, setManualMode] = useState(false);
	const [gameAudioIndicatorRep] = useReplicant<number>("game-audio-indicator", -1);
	const [runDataRep] = useReplicant<RunData | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const zippedRunnersAndGameAudio: ZippedRunnerAudio[] = useMemo(() => {
		const data: ZippedRunnerAudio[] = [];

		if (!runDataRep?.teams || runDataRep.teams.length == 0) {
			return data;
		}

		// Multiple teams gets same console
		if (runDataRep.teams.length > 1) {
			for (let i = 0; i < GAME_AUDIO_CHANNELS.length; i++) {
				const gameAudio = GAME_AUDIO_CHANNELS[i];
				let runnerAudio: ZippedRunnerAudio = {
					audioInfo: gameAudio,
				};

				if (i < runDataRep.teams.length) {
					const team = runDataRep.teams[i];
					runnerAudio.runner = {
						name: team.players.map((player) => player.name).join(", "),
						id: team.id,
					};
				}

				data.push(runnerAudio);
			}

			return data;
		}

		/** Single team co-op gets different game audio channels in the event of different consoles */
		const team = runDataRep.teams[0];

		// Somehow have a team with no players
		if (team.players.length == 0) {
			return [
				{
					audioInfo: GAME_AUDIO_CHANNELS[0],
					runner: {
						name: team.name ?? team.id,
						id: team.id,
					},
				},
			];
		}

		// Co-op 2+ players
		if (team.players.length > 1) {
			for (let i = 0; i < GAME_AUDIO_CHANNELS.length; i++) {
				const gameAudio = GAME_AUDIO_CHANNELS[i];
				let runnerAudio: ZippedRunnerAudio = {
					audioInfo: gameAudio,
				};

				if (i < team.players.length) {
					const player = team.players[i];
					runnerAudio.runner = { name: player.name, id: player.id };
				}

				data.push(runnerAudio);
			}

			return data;
		}

		// 1 Player
		const player = team.players[0];
		return [
			{
				audioInfo: GAME_AUDIO_CHANNELS[0],
				runner: { name: team.players[0].name, id: player.id },
			},
		];
	}, [runDataRep?.teams]);

	function updateGameAudioIndicator(index?: number) {
		if (!index) {
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
				{zippedRunnersAndGameAudio.map((data, i) => {
					return (
						<GameAudioComponent
							channelInfo={data.audioInfo}
							runner={data.runner}
							key={data.audioInfo.name}
							setAudioLive={(checked) => {
								if (checked) {
									updateGameAudioIndicator(i);
								}
							}}
							live={gameAudioIndicatorRep === i}
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
	text-align: right;
`;

interface GameAudioComponentProps {
	channelInfo: (typeof GAME_AUDIO_CHANNELS)[number];
	runner?: ZippedRunnerAudio["runner"];
	setAudioLive: (checked: boolean) => void;
	live: boolean;
}

const GameAudioComponent = (props: GameAudioComponentProps) => {
	const [enabled, setEnabled] = useState(Boolean(props.runner));
	const [gameAudioName, setGameAudioName] = useState("");

	console.log(props, enabled);

	useEffect(() => {
		if (enabled) {
			setGameAudioName(props.runner?.name ?? props.channelInfo.name);
		} else {
			setGameAudioName("");
		}
	}, [enabled]);

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
			/>
			<Checkbox checked={enabled} onChange={(_, value) => setEnabled(value)} />
			<ChannelName style={{ opacity: enabled ? 1 : 0.6 }}>{props.channelInfo.channels.join("/")}</ChannelName>
		</GameAudioComponentContainer>
	);
};

createRoot(document.getElementById("root")!).render(<DashboardGameAudio />);
