import { cloneElement, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import { Button, ThemeProvider, useColorScheme } from "@mui/material";
import { Description, Edit, Tune, ResetTv, DarkMode, LightMode } from "@mui/icons-material";
import { useReplicant } from "@nodecg/react-hooks";
import { Mosaic, type MosaicNode, MosaicWindow } from "react-mosaic-component";
import "react-mosaic-component/react-mosaic-component.css";

import "./host-dash.css";

import { HostEditDialog } from "./dashboards/host-dash/host-edit-dialog.js";
import { ScriptDialog } from "./dashboards/host-dash/script-dialog.js";
import { Timer } from "./dashboards/host-dash/timer.js";
import { HostTabs } from "./dashboards/host-dash/host-tabs.js";
import { Header } from "./dashboards/host-dash/header.js";
import { DonationMatches } from "./dashboards/host-dash/donation-matches.js";
import { UpNext } from "./dashboards/host-dash/upnext.js";
import { AudioDialog } from "./dashboards/host-dash/audio-dialog.js";
import { DonationTabs } from "./dashboards/host-dash/donation-tabs.js";
import { DonationTotal } from "./dashboards/host-dash/donation-total.js";
import { HostMicrophone } from "./dashboards/host-dash/host-microphone.js";

import type { RunDataPlayer } from "@asm-graphics/types/RunData.js";
import styles from "./host-dashboard.module.css";

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
	type: "split",
	direction: "row",
	children: [
		{
			type: "split",
			direction: "row",
			children: [
				{
					type: "split",
					direction: "column",
					children: ["Timer", "Host Tabs"],
					splitPercentages: [50, 50],
				},
				{
					type: "split",
					direction: "column",
					children: [
						{
							type: "split",
							direction: "column",
							children: ["Mute", "Donation Total"],
							splitPercentages: [50, 50],
						},
						"Donation Tabs",
					],
					splitPercentages: [20, 80],
				},
			],
			splitPercentages: [50, 50],
		},
		{
			type: "split",
			direction: "column",
			children: ["Donation Matches", "Next Runs"],
			splitPercentages: [50, 50],
		},
	],
	splitPercentages: [(2 / 3) * 100, (1 / 3) * 100],
};

export function HostDash() {
	const { mode } = useColorScheme();
	const [mosaicValue, setMosaicValue] = useState<MosaicNode<ViewId> | null>(initialLayout);

	const [commentatorsRep] = useReplicant("commentators");
	const host = (commentatorsRep ?? []).find((comm) => comm.customData["tag"] === "Host");

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

	function playIntermissionVideo(ad: string, length: number) {
		const adLength = length + 10;

		setPlayingAd(adLength);
		void nodecg.sendMessage("intermission-videos:play", ad);

		setTimeout(() => {
			setPlayingAd(undefined);
		}, adLength * 1000); // 10 to account for transition into ad
	}

	useEffect(() => {
		if (!adProgressBarRef.current) return;

		adProgressBarRef.current.style.animationDuration = `${playingAd}s`;
	}, [playingAd]);

	return (
		<div className={clsx(styles.dashContainer, mode === "dark" ? styles.darkMode : styles.lightMode)}>
			<div className={styles.topBar}>
				<p>YOU ARE:</p>
				<h2>
					{host?.name} <span className="pronouns">{host?.pronouns}</span>
				</h2>
				<Button onClick={() => setHostOpen(true)}>
					<Edit />
				</Button>
				<div className={styles.spacer} />
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
					style={{ cursor: "pointer", textAlign: "right", fontVariantNumeric: "tabular-nums" }}
				>
					{currentTimeRef.current}
				</p>
			</div>

			{playingAd && (
				<div className={styles.adProgressBarContainer}>
					<div className={styles.adProgressBar} ref={adProgressBarRef} />
					<div className={styles.adProgressBarLabel}>Advert Playing</div>
				</div>
			)}

			<HostEditDialog open={hostOpen} submit={() => setHostOpen(false)} onClose={() => setHostOpen(false)} />
			<ScriptDialog playAd={playIntermissionVideo} open={scriptsOpen} onClose={() => setScriptsOpen(false)} />
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
						)}
					>
						{cloneElement(ELEMENTS[id], { darkMode: mode === "dark" })}
					</MosaicWindow>
				)}
				value={mosaicValue}
				onChange={(newLayout) => setMosaicValue(newLayout)}
			/>
		</div>
	);
}

function ColourSchemeButton() {
	const { mode, setMode } = useColorScheme();
	const isDarkMode = mode === "dark";

	const handleToggle = () => {
		console.log("Toggling colour scheme to", mode === "dark" ? "light" : "dark");
		setMode(mode === "dark" ? "light" : "dark");
	};

	return (
		<Button onClick={handleToggle}>
			{isDarkMode ? <LightMode /> : <DarkMode />}
			{isDarkMode ? "Light Mode" : "Dark Mode"}
		</Button>
	);
}

export const hostDashTheme = createTheme({
	palette: {
		primary: { main: "#CC7722" },
		secondary: { main: "#03a9f4" },
	},
	colorSchemes: {
		dark: true,
	},
});

function HostDashApp() {
	return (
		<ThemeProvider theme={hostDashTheme}>
			<HostDash />
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<HostDashApp />);
