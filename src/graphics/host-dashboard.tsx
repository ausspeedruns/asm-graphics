import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { Description, Edit, Tune, ResetTv, DarkMode, LightMode } from "@mui/icons-material";
import { Button, ThemeProvider, useColorScheme } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";
import { Mosaic, MosaicNode, MosaicWindow } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";
import { darkTheme } from "../dashboard/theme";

import { HostEditDialog } from "./dashboards/host-dash/host-edit-dialog";
import { ScriptDialog } from "./dashboards/host-dash/script-dialog";
import { Timer } from "./dashboards/host-dash/timer";
import { HostTabs } from "./dashboards/host-dash/host-tabs";
import { Header } from "./dashboards/host-dash/header";
import { DonationMatches } from "./dashboards/host-dash/donation-matches";
import { UpNext } from "./dashboards/host-dash/upnext";
import { AudioDialog } from "./dashboards/host-dash/audio-dialog";
import { DonationTabs } from "./dashboards/host-dash/donation-tabs";
import { DonationTotal } from "./dashboards/host-dash/donation-total";
import { HostMicrophone } from "./dashboards/host-dash/host-microphone";

import type { Commentator } from "@asm-graphics/types/OverlayProps";

const DashContainer = styled.div<{ darkMode: boolean }>`
	color-scheme: ${(props) => (props.darkMode ? "dark" : "light")};

	--orange: #cc7722;
	--teal: #3f7d8f;
	--background-color: var(--orange);
	--text-color: light-dark(#000000, #ffffff);
	--top-bar-background: light-dark(var(--teal), #0c1017);
	--mosaic-background: light-dark(#e9e9e9, #05070a);
	--panel-background: light-dark(#ffffff, #05070a);
	--inset-background: light-dark(#eeeeee, #2f2f2f);
	--inset-background-2: light-dark(#dddddd,#3f3f3f);

	transition:
		background 0.25s,
		color 0.25s,
		--background-color 0.25s,
		--text-color 0.25s,
		--top-bar-background 0.25s,
		--mosaic-background 0.25s,
		--panel-background 0.25s,
		--inset-background 0.25s;

	.mosaic {
		background-color: var(--mosaic-background);
		transition: background-color 0.25s;

		.mosaic-window {
			border: 1px solid var(--orange);
			border-radius: 8px;

			.mosaic-window-body {
				background-color: var(--panel-background);
				transition: background-color 0.25s;
			}

			.mosaic-window-toolbar {
				box-shadow: none;
				border-radius: 0;
				height: 45px;
			}
		}
	}

	min-width: 100vw;
	min-height: 100vh;
	padding-top: 72px;

	font-family:
		Noto Sans,
		sans-serif;

	display: grid;

	background: var(--background-color);
	color: var(--text-color);

	box-sizing: border-box;
	* {
		box-sizing: border-box;
	}
`;

const TopBar = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	background: var(--top-bar-background);
	width: 100%;
	height: 72px;
	padding: 8px 24px;

	display: flex;
	align-items: center;
	gap: 12px;

	p,
	h2 {
		color: white;
		line-height: 72px;
		margin: 0;
		padding: 0;
	}

	p {
		font-size: 20px;
	}

	h2 {
		display: flex;
		align-items: center;
		gap: 8px;

		.pronouns {
			font-size: 50%;
		}
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		font-weight: bold;
		font-size: 16px;

		min-width: 0;

		padding: 8px;
		color: white;
		background: var(--accent-color);
		border: 2px solid white;
		border-radius: 6px;

		&:hover {
			background: white;
			border: 2px solid var(--accent-color);
			color: var(--accent-color);
		}
	}
`;

const Spacer = styled.div`
	flex-grow: 1;
`;

const AdProgressBarContainer = styled.div`
	width: 100%;
	height: 20px;
	position: absolute;
	top: 72px;
	left: 0;

	display: flex;
	justify-content: center;
	background-color: var(--ad-progress-bg);

	z-index: 10;
`;

const AdProgressBar = styled.div`
	width: 100%;
	background-color: var(--ad-progress-fill);

	animation: progressBarAnimation;
	animation-timing-function: linear;
	animation-duration: 15s;

	@keyframes progressBarAnimation {
		0% {
			width: 100%;
		}
		100% {
			width: 0%;
		}
	}
`;

const AdProgressBarLabel = styled.div`
	position: absolute;
	text-align: center;
	white-space: nowrap;
	font-weight: bold;
	color: white;
`;

type ViewId = keyof typeof ELEMENTS;

const ELEMENTS = {
	Timer: <Timer />,
	"Host Tabs": <HostTabs />,
	Mute: <HostMicrophone />,
	"Donation Total": <DonationTotal />,
	"Donation Matches": <DonationMatches />,
	"Donation Tabs": <DonationTabs />,
	"Next Runs": <UpNext />,
};

const initialLayout: MosaicNode<ViewId> = {
	direction: "row",
	first: {
		direction: "row",
		first: {
			direction: "column",
			first: "Timer",
			second: "Host Tabs",
		},
		second: {
			direction: "column",
			first: {
				direction: "column",
				first: "Mute",
				second: "Donation Total",
			},
			second: "Donation Tabs",
			splitPercentage: 20,
		},
	},
	second: {
		direction: "column",
		first: "Donation Matches",
		second: "Next Runs",
	},
	splitPercentage: (2 / 3) * 100,
};

export const HostDash: React.FC = () => {
	const { mode } = useColorScheme();
	const [mosaicValue, setMosaicValue] = useState<MosaicNode<ViewId> | null>(initialLayout);

	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);

	const [hostOpen, setHostOpen] = useState(false);
	const [scriptsOpen, setScriptsOpen] = useState(false);
	const [audioOpen, setAudioOpen] = useState(false);

	const currentTimeElRef = useRef<HTMLParagraphElement>(null);
	const currentTimeRef = useRef("00:00:00");
	const [timeFormat, setTimeFormat] = useState(true); // False: 24hr, True: 12 Hour

	const [playingAd, setPlayingAd] = useState<number | undefined>();
	const adProgressBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			if (!currentTimeRef.current || !currentTimeElRef.current) return;

			const newTime = new Date().toLocaleTimeString(timeFormat ? "en-AU" : "en-GB");

			if (currentTimeRef.current === newTime) return;

			currentTimeRef.current = newTime;
			currentTimeElRef.current.innerText = newTime;
		}, 200);

		return () => clearInterval(interval);
	}, [timeFormat]);

	function playAd(ad: string, length: number) {
		const adLength = length + 10;

		setPlayingAd(adLength);
		nodecg.sendMessage("playAd", ad);

		setTimeout(() => {
			setPlayingAd(undefined);
		}, adLength * 1000); // 10 to account for transition into ad
	}

	useEffect(() => {
		if (!adProgressBarRef.current) return;

		adProgressBarRef.current.style.animationDuration = `${playingAd}s`;
	}, [adProgressBarRef.current, playingAd]);

	return (
		<DashContainer darkMode={mode === "dark"}>
			<TopBar>
				<p>YOUR HOST:</p>
				<h2>
					{hostRep?.name} <span className="pronouns">{hostRep?.pronouns}</span>
				</h2>
				<Button onClick={() => setHostOpen(true)}>
					<Edit />
				</Button>
				<Spacer />
				<Button onClick={() => setAudioOpen(true)}>
					<Tune />
					Audio
				</Button>
				<Button onClick={() => setScriptsOpen(true)}>
					<Description />
					Scripts
				</Button>
				<Button onClick={() => setMosaicValue(initialLayout)}>
					<ResetTv />
					Reset Layout
				</Button>
				<ColourSchemeButton />
				<p
					ref={currentTimeElRef}
					onClick={() => {
						setTimeFormat(!timeFormat);
					}}
					style={{ cursor: "pointer", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
					{currentTimeRef.current}
				</p>
			</TopBar>

			{playingAd && (
				<AdProgressBarContainer>
					<AdProgressBar ref={adProgressBarRef} />
					<AdProgressBarLabel>Advert Playing</AdProgressBarLabel>
				</AdProgressBarContainer>
			)}

			<HostEditDialog open={hostOpen} submit={() => setHostOpen(false)} onClose={() => setHostOpen(false)} />
			<ScriptDialog playAd={playAd} open={scriptsOpen} onClose={() => setScriptsOpen(false)} />
			<AudioDialog open={audioOpen} onClose={() => setAudioOpen(false)} />
			<Mosaic<ViewId>
				renderTile={(id, path) => (
					<MosaicWindow<ViewId>
						path={path}
						title={id}
						renderToolbar={(props) => (
							<div style={{ width: "100%", height: "100%" }}>
								<Header text={props.title} />
							</div>
						)}>
						{React.cloneElement(ELEMENTS[id], { darkMode: mode === "dark" })}
					</MosaicWindow>
				)}
				value={mosaicValue}
				onChange={(newLayout) => setMosaicValue(newLayout)}
			/>
		</DashContainer>
	);
};

function ColourSchemeButton() {
	const { mode, setMode } = useColorScheme();
	const isDarkMode = mode === "dark";

	const handleToggle = () => {
		setMode(mode === "dark" ? "light" : "dark");
	};

	return (
		<Button onClick={handleToggle}>
			{isDarkMode ? <LightMode /> : <DarkMode />}
			{isDarkMode ? "Light Mode" : "Dark Mode"}
		</Button>
	);
}

function HostDashApp() {
	return (
		<ThemeProvider theme={darkTheme}>
			<HostDash />
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<HostDashApp />);
