import React, { useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { CurrentOverlay } from '../types/CurrentOverlay';
import { Stream as TwitchStream } from '../types/Streams';
// import { RunDataActiveRun } from '../types/RunData';

import {
	ThemeProvider,
	Switch,
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
} from '@material-ui/core';
import { darkTheme } from './theme';
// import { GameplayRouterParent } from '../graphics/gameplay-overlay';
import { ASMStream } from '../graphics/elements/individual-stream';
import { StreamSwitcher } from './elements/stream-switcher';
import { StreamAudio } from './elements/stream-audio';
import { RunData } from '../types/RunData';

const GreenSwitch = styled(Switch)`
	.MuiSwitch-colorPrimary.Mui-checked {
		color: #4caf50;
	}

	.MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
		background-color: #4caf50;
	}
`;

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

const StreamKeyLink = styled.span`
	text-decoration: underline;
	color: #eee;
	height: 38px;
	cursor: pointer;
`;

const DashOBS: React.FC = () => {
	// const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	// const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
	// 	namespace: 'nodecg-speedcontrol',
	// });
	const [currentOverlay] = useReplicant<CurrentOverlay, undefined>('currentOverlay', undefined);
	const [twitchStreamsRep] = useReplicant<TwitchStream[], TwitchStream[]>('twitchStreams', []);
	const [currentSceneRep] = useReplicant<string, string>('obsCurrentScene', 'Game Overlay');
	const [connectionRep] = useReplicant<boolean, boolean>('obsConnection', false);
	const [showKeys, setShowKeys] = useState(false);

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
		return currentSceneRep !== 'Intermission' && (stream.state === 'live' || stream.state === 'both');
	});

	// Live twitch streams
	const liveStreamElements = liveStreamsList.map((stream) => {
		return <PreviewStream channel={stream.channel} size={stream.size} key={stream.channel} muted />;
	});

	// Labels to say which streams are live
	const liveStreamNotif = liveStreamsList.map((stream) => {
		return (
			<div key={stream.channel}>
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
	const handleOBSConnection = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			nodecg.sendMessage('connectOBS');
		} else {
			nodecg.sendMessage('disconnectOBS');
		}
	};

	const previewOverlayChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		nodecg.sendMessage('changeOverlayPreview', event.target.value as string);
	};

	const gameplayTransition = () => {
		nodecg.sendMessage('transitionGameplay');
	};

	const goToIntermission = () => {
		nodecg.sendMessage('goToIntermission');
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<Flex>
				<VFlex>
					<FormControlLabel
						control={<GreenSwitch color="primary" checked={connectionRep} onChange={handleOBSConnection} />}
						label="OBS Connection"
					/>
					<SideTitle>PREVIEW</SideTitle>
					<GameplaySpacer>
						<GameplayPreview>
							<iframe
								height="1080"
								width="1920"
								style={{
									overflow: 'hidden',
									border: 0,
								}}
								scrolling="no"
								src="http://localhost:9090/bundles/asm2021-graphics/graphics/preview-gameplay.html"
							/>
						</GameplayPreview>
					</GameplaySpacer>
					<StreamSwitcher currentStreams={twitchStreamsRep} />
					<FormControl variant="filled" fullWidth>
						<InputLabel id="obs-gameplay-select-label">Layout</InputLabel>
						<Select
							labelId="obs-gameplay-select-label"
							id="obs-gameplay-select"
							value={currentOverlay?.preview || 'standard'}
							onChange={previewOverlayChange}>
							<MenuItem value="standard">Standard</MenuItem>
							<MenuItem value="standard-2">Standard 2p</MenuItem>{' '}
							{/* Standard 2p is unused in FAST so possibly have it commented out */}
							<MenuItem value="widescreen">Widescreen</MenuItem>
							<MenuItem value="widescreen-2">Widescreen 2p</MenuItem>
							<MenuItem value="widescreen-1610">Widescreen 16:10</MenuItem>
							<MenuItem value="gba">Gameboy Advanced</MenuItem>
							<MenuItem value="gbc">Gameboy Colour</MenuItem>
							<MenuItem value="ds">Nintendo DS</MenuItem>
							<MenuItem value="none">None</MenuItem>
						</Select>
					</FormControl>
				</VFlex>
				<VFlex style={{ flexGrow: 1, margin: '0 8px', paddingTop: '14%', alignItems: 'center' }}>
					<ButtonGroup orientation="vertical" fullWidth>
						<Button
							variant="contained"
							onClick={gameplayTransition}
							disabled={currentSceneRep === 'Game Overlay'}>
							Transition
						</Button>
						<Button
							variant="contained"
							onClick={goToIntermission}
							disabled={currentSceneRep === 'Intermission'}>
							Intermission
						</Button>
					</ButtonGroup>
				</VFlex>
				<VFlex>
					<StreamKeyLink onClick={showDialog}>Stream Keys</StreamKeyLink>
					<SideTitle>LIVE</SideTitle>
					<GameplaySpacer>
						<GameplayPreview>
							{currentSceneRep === 'Game Overlay' ? liveStreamElements : <></>}
							{currentSceneRep === 'Game Overlay' ? (
								<iframe
									height="1080"
									width="1920"
									style={{
										overflow: 'hidden',
										border: 0,
									}}
									scrolling="no"
									src="http://localhost:9090/bundles/asm2021-graphics/graphics/gameplay-overlay.html"
								/>
							) : (
								<iframe
									height="1080"
									width="1920"
									style={{
										overflow: 'hidden',
										border: 0,
									}}
									scrolling="no"
									src="http://localhost:9090/bundles/asm2021-graphics/graphics/intermission-muted.html"
								/>
							)}
						</GameplayPreview>
					</GameplaySpacer>

					{currentSceneRep === 'Game Overlay' ? liveStreamNotif : <></>}
					{streamAudioControllers.length > 1 ? <DashAudio /> : <></>}
					<Flex style={{ justifyContent: 'center', flexGrow: 1, minHeight: 200 }}>
						{streamAudioControllers}
					</Flex>
				</VFlex>
			</Flex>
			<Dialog open={showKeys} onClose={hideDialog}>
				<DialogTitle id="alert-dialog-title">{'Stream keys'}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						ASM Station 1: live_473924910_2S0hWK9YDW0ZAdWtDFVDbE2hMey3co
						<br/>
						ASM Station 2: live_473929210_UoNk8CSlFVDjCigGzBbAbkjkkJResd
						<br/>
						ASM Station 3: live_473929692_aTABs4SJ1vBwRcs1oQxMfhghL5tTXE
						<br/>
						ASM Station 4: live_582054304_kKhZGtRnk21Dt211rL9lEhkCdyuvD5
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={hideDialog} color="primary">
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
	const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	const [runDataRep] = useReplicant<RunData, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});

	const runnerOptions = runDataRep?.teams.map((team) => {
		const firstPlayerName = team.players[0].name;
		return (
			<FormControlLabel
				value={team.id}
				control={<RadioStyled />}
				label={team.name || firstPlayerName}
				key={team.id}
			/>
		);
	});

	const updateAudioIndicator = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
		nodecg.sendMessage('update-audioindicator', value);
	};

	return (
		<DashAudioContainer>
			<FormLabelStyled>Audio Indicator</FormLabelStyled>
			<RadioGroup value={audioIndicatorRep} onChange={updateAudioIndicator}>
				{runnerOptions}
			</RadioGroup>
		</DashAudioContainer>
	);
};

render(<DashOBS />, document.getElementById('obs'));
