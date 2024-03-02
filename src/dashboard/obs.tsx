import React, { useState } from "react";
// import { createRoot } from 'react-dom/client';
import styled from "styled-components";
import { useReplicant } from "use-nodecg";

import { CurrentOverlay } from "@asm-graphics/types/CurrentOverlay";
import { Stream as TwitchStream } from "@asm-graphics/types/Streams";
// import { RunDataActiveRun } from '@asm-graphics/types/RunData';

import {
	ThemeProvider,
	FormControlLabel,
	Radio,
	FormControl,
	FormLabel,
	RadioGroup,
	Button,
	ButtonGroup,
	InputLabel,
	MenuItem,
	Select,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from "@mui/material";
import { Filter1, Filter2, Filter3, Filter4, OpenInNew } from "@mui/icons-material";
import { darkTheme } from "./theme";
import { ASMStream } from "../graphics/elements/individual-stream";
import { StreamSwitcher } from "./elements/stream-switcher";
import { StreamAudio } from "./elements/stream-audio";
import type { RunData } from "@asm-graphics/types/RunData";
import type { OBSAudioIndicator } from "@asm-graphics/types/Audio";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";

const SideTitle = styled.span`
	font-weight: bold;
	font-size: 24px;
`;

const GameplayHeight = 168.75;

const GameplaySpacer = styled.div`
	position: relative;
	height: ${GameplayHeight}px;
	width: ${(GameplayHeight / 9) * 16}px;
`;

const GameplayPreview = styled.div`
	position: absolute;
	height: 1080px;
	width: 1920px;
	overflow: hidden;
	color: #000000;
	transform: scale(${GameplayHeight / 1080});
	transform-origin: 0 0;
`;

const PreviewStream = styled(ASMStream)`
	z-index: -1;
	position: absolute;
	height: 1080px;
	width: 1920px;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
`;

const VFlex = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const OBSIndicator = styled.span`
	height: 36px;
`;

// @ts-ignore
const DashOBS: React.FC = () => {
	// const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	// const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
	// 	namespace: 'nodecg-speedcontrol',
	// });
	const ncgConfig = nodecg.config;
	const bundleConfig = nodecg.bundleConfig;
	const [currentOverlay] = useReplicant<CurrentOverlay | undefined>("currentOverlay", undefined);
	const [twitchStreamsRep] = useReplicant<TwitchStream[]>("twitchStreams", []);
	const [currentSceneRep] = useReplicant<string>("obs:currentScene", "Game Overlay");
	const [connectionRep] = useReplicant<ConnectionStatus>("obs:status", "disconnected");
	const [showKeys, setShowKeys] = useState(false);
	const [showRefreshDialog, setShowRefreshDialog] = useState(false);

	const showDialog = () => {
		setShowKeys(true);
	};

	const hideDialog = () => {
		setShowKeys(false);
	};

	// Preview twitch streams
	// const previewStreamElements = twitchStreamsRep
	// 	.filter((ogStream) => {
	// 		return ogStream.state === 'preview';
	// 	})
	// 	.map((stream) => {
	// 		return <PreviewStream channel={stream.channel} size={stream.size} key={stream.channel} />;
	// 	});

	// Get list of only live streams
	const liveStreamsList = twitchStreamsRep.filter((stream) => {
		return currentSceneRep !== "Intermission" && (stream.state === "live" || stream.state === "both");
	});

	// Live twitch streams
	const liveStreamElements = liveStreamsList.map((stream) => {
		return <PreviewStream channel={stream.channel} size={stream.size} key={stream.channel} muted />;
	});

	// Labels to say which streams are live
	const liveStreamNotif = liveStreamsList.map((stream) => {
		return (
			<div key={stream.channel} style={{ display: "inline" }}>
				<b>{stream.channel}</b>: {stream.size}
			</div>
		);
	});

	// Create stream audio controllers
	const streamAudioControllers = liveStreamsList.map((stream) => {
		const obsSourceName = `ASM Station ${stream.channel.slice(-1)}`;
		return <StreamAudio source={obsSourceName} key={stream.channel} />;
	});

	/* FUNCTIONS */
	const previewOverlayChange = (event: { target: { value: string } }) => {
		nodecg.sendMessage("changeOverlayPreview", event.target.value);
	};

	const gameplayTransition = () => {
		nodecg.sendMessageToBundle("changeToNextRun", "nodecg-speedcontrol");
		nodecg.sendMessage("transitionGameplay");
	};

	const goToIntermission = () => {
		nodecg.sendMessage("goToIntermission");
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<Flex>
				<VFlex>
					{connectionRep === "connected" ? (
						<OBSIndicator style={{ color: "#4caf50" }}>OBS Connected</OBSIndicator>
					) : (
						<OBSIndicator style={{ color: "red", fontWeight: "bolder" }}>
							OBS NOT CONNECTED!!!!!!
						</OBSIndicator>
					)}
					<SideTitle
						style={{ cursor: "pointer" }}
						onClick={() =>
							window.open(
								`${ncgConfig.ssl?.enabled ? "https" : "http"}://${
									bundleConfig.hostname ?? "localhost"
								}:${ncgConfig.port}/bundles/asm-graphics/graphics/preview-gameplay.html`,
								"_blank",
							)
						}
					>
						PREVIEW
						<OpenInNew viewBox="0 0 30 30" />
					</SideTitle>
					<GameplaySpacer>
						<GameplayPreview>
							<iframe
								height="1080"
								width="1920"
								style={{
									overflow: "hidden",
									border: 0,
								}}
								scrolling="no"
								src={`${ncgConfig.ssl?.enabled ? "https" : "http"}://${
									bundleConfig.hostname ?? "localhost"
								}:${ncgConfig.port}/bundles/asm-graphics/graphics/preview-gameplay.html`}
							/>
						</GameplayPreview>
					</GameplaySpacer>
					<StreamSwitcher currentStreams={twitchStreamsRep} />
					<FormControl variant="filled" fullWidth>
						<InputLabel id="obs-gameplay-select-label">Layout</InputLabel>
						<Select
							labelId="obs-gameplay-select-label"
							id="obs-gameplay-select"
							value={currentOverlay?.preview ?? "standard"}
							onChange={previewOverlayChange}
						>
							<MenuItem value="standard">Standard</MenuItem>
							<MenuItem value="standard-2">Standard 2p</MenuItem>
							<MenuItem value="widescreen">Widescreen</MenuItem>
							<MenuItem value="widescreen-2">Widescreen 2p</MenuItem>
							<MenuItem value="Widescreen-3">Widescreen 3p</MenuItem>
							<MenuItem value="widescreen-1610">Widescreen 16:10</MenuItem>
							<MenuItem value="gba">Gameboy Advanced</MenuItem>
							<MenuItem value="gbc">Gameboy Colour</MenuItem>
							<MenuItem value="3ds">Nintendo 3DS</MenuItem>
							<MenuItem value="ds">Nintendo DS</MenuItem>
							<MenuItem value="ds-2">Nintendo DS 2p</MenuItem>
							<MenuItem value="whg">World&apos;s Hardest Game (11:8)</MenuItem>
							<MenuItem value="none">None</MenuItem>
						</Select>
					</FormControl>
				</VFlex>
				<VFlex
					style={{
						flexGrow: 1,
						margin: "0 8px",
						paddingTop: "14%",
						alignItems: "center",
					}}
				>
					<ButtonGroup orientation="vertical" fullWidth>
						<Button
							variant="contained"
							onClick={gameplayTransition}
							disabled={currentSceneRep === "Game Overlay" || connectionRep === "disconnected"}
						>
							Transition
						</Button>
						<Button
							variant="contained"
							onClick={goToIntermission}
							disabled={currentSceneRep === "Intermission" || connectionRep === "disconnected"}
						>
							Intermission
						</Button>
					</ButtonGroup>
					<span style={{ textAlign: "center", marginTop: 8 }}>
						Transition in: Instant
						<br />
						Transition out: Delay by 5s
					</span>
				</VFlex>
				<VFlex>
					<div style={{ display: "flex" }}>
						<Button variant="outlined" onClick={showDialog}>
							Stream Keys
						</Button>
						<Button onClick={() => setShowRefreshDialog(true)}>Refresh Graphics</Button>
					</div>
					<SideTitle>LIVE</SideTitle>
					<GameplaySpacer>
						<GameplayPreview>
							{currentSceneRep === "Game Overlay" && liveStreamElements}
							{currentSceneRep === "Game Overlay" ? (
								<iframe
									height="1080"
									width="1920"
									style={{
										overflow: "hidden",
										border: 0,
									}}
									scrolling="no"
									src={`${ncgConfig.ssl?.enabled ? "https" : "http"}://${
										bundleConfig.hostname ?? "localhost"
									}:${ncgConfig.port}/bundles/asm-graphics/graphics/gameplay-overlay.html`}
								/>
							) : (
								<iframe
									height="1080"
									width="1920"
									style={{
										overflow: "hidden",
										border: 0,
									}}
									scrolling="no"
									src={`${ncgConfig.ssl?.enabled ? "https" : "http"}://${
										bundleConfig.hostname ?? "localhost"
									}:${ncgConfig.port}/bundles/asm-graphics/graphics/intermission-muted.html`}
								/>
							)}
						</GameplayPreview>
					</GameplaySpacer>

					{currentSceneRep === "Game Overlay" && (
						<div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
							{liveStreamNotif}
						</div>
					)}
					{streamAudioControllers.length > 1 && <DashAudio />}
					<Flex
						style={{
							justifyContent: "center",
							flexGrow: 1,
							minHeight: 260,
						}}
					>
						{streamAudioControllers}
					</Flex>
				</VFlex>
			</Flex>
			<Dialog open={showKeys} onClose={hideDialog} maxWidth="md">
				<DialogTitle id="alert-dialog-title">{"Stream keys"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<div>
							ASM Station 1: live_473924910_QRkHAf9mmudxB85MoGxEqOftOmjdBB
							<IconButton
								onClick={() =>
									navigator.clipboard.writeText("live_473924910_QRkHAf9mmudxB85MoGxEqOftOmjdBB")
								}
							>
								<Filter1 />
							</IconButton>
						</div>
						<div>
							ASM Station 2: live_473929210_fGqAZD4iiN0LgTfu54U5eD70QXftbO
							<IconButton
								onClick={() =>
									navigator.clipboard.writeText("live_473929210_fGqAZD4iiN0LgTfu54U5eD70QXftbO")
								}
							>
								<Filter2 />
							</IconButton>
						</div>
						<div>
							ASM Station 3: live_473929692_Wqsye5ccxS3b4mEksq2AIMfIyJqofF
							<IconButton
								onClick={() =>
									navigator.clipboard.writeText("live_473929692_Wqsye5ccxS3b4mEksq2AIMfIyJqofF")
								}
							>
								<Filter3 />
							</IconButton>
						</div>
						<div>
							ASM Station 4: live_582054304_bf1NHWJcfHHafE4sIewIykjrnaislr
							<IconButton
								onClick={() =>
									navigator.clipboard.writeText("live_582054304_bf1NHWJcfHHafE4sIewIykjrnaislr")
								}
							>
								<Filter4 />
							</IconButton>
						</div>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={hideDialog} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={showRefreshDialog} onClose={() => setShowRefreshDialog(false)}>
				<DialogTitle id="alert-dialog-title">{"Refresh graphics"}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Go to the Graphics page and press reload on the graphic needing to be refreshed:
						<ul>
							<li>
								<b>Ticker</b> Controls the bar at the bottom of the screen
							</li>
							<li>
								<b>Intermission</b> The whole intermission screen
							</li>
							<li>
								<b>Transition</b> Unused: transition is done via a video in OBS
							</li>
							<li>
								<b>Gameplay-Overlay</b> The gameplay screen that is streamed
							</li>
							<li>
								<b>Stream</b> The individual twitch streams
							</li>
							<li>Host-Dashboard, Dashboard the host watches</li>
							<li>
								<b>Preview-Graphic</b> The graphic shown on the OBS panel on the dashboard
							</li>
							<li>
								<b>Intermission-Muted</b> The intermission graphic shown on the OBS panel
							</li>
						</ul>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowRefreshDialog(false)} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
};

const DashAudioContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const FormLabelStyled = styled(FormLabel)`
	color: #fff !important;
`;

const RadioStyled = styled(Radio)`
	color: #fff !important;
	& .Mui-checked {
		color: #2d4e8a !important;
	}
`;

export const DashAudio: React.FC = () => {
	const [audioIndicatorRep] = useReplicant<number>("game-audio-indicator", -1);
	const [runDataRep] = useReplicant<RunData | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const [obsInputsRep] = useReplicant<string[]>("obs-audio-inputs", []);
	const [obsAudioIndicatorRep] = useReplicant<OBSAudioIndicator[]>("obs-audio-indicator", []);

	const AudioInputOptions = obsInputsRep.map((input) => (
		<MenuItem key={input} value={input}>
			{input}
		</MenuItem>
	));

	const updateObsIndicator = (data: { id: string; inputName: string }) => {
		if (data.inputName === "") {
			nodecg.sendMessage("remove-obs-audio", data.id);
		} else {
			nodecg.sendMessage("update-obs-audio", { id: data.id, inputName: data.inputName });
		}
	};

	const runnerOptions = runDataRep?.teams.map((team) => {
		return team.players.map((player, i) => {
			return (
				<div key={player.id}>
					<FormControlLabel value={player.id} control={<RadioStyled />} label={player.name} key={player.id} />

					<FormControl size="medium">
						<InputLabel id={`obs-input-${i}-id`}>Audio Input</InputLabel>
						<Select
							labelId={`obs-input-${i}-id`}
							id={`obs-input-${i}`}
							value={obsAudioIndicatorRep.find((audio) => audio.id === player.id)?.inputName}
							label="Audio Input"
							onChange={(e) => {
								updateObsIndicator({ id: player.id, inputName: e.target.value });
							}}
						>
							<MenuItem key={i} value={""}>
								<i>None</i>
							</MenuItem>
							{AudioInputOptions}
						</Select>
					</FormControl>
				</div>
			);
		});
	});

	const updateAudioIndicator = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
		nodecg.sendMessage("update-audioindicator", value);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<DashAudioContainer>
				<FormLabelStyled>Audio Indicator</FormLabelStyled>
				<RadioGroup value={audioIndicatorRep} onChange={updateAudioIndicator}>
					{runnerOptions}
				</RadioGroup>
			</DashAudioContainer>
		</ThemeProvider>
	);
};

// createRoot(document.getElementById('root')!).render(<DashOBS />);
