import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { ThemeProvider, createTheme } from "@mui/material";
import usePrevious from "@asm-graphics/shared/hooks/usePrevious";

// import type { Timer } from '@asm-graphics/types/Timer';

import { RTAudio } from "./dashboards/runner-tablet/audio";
import { RTNames } from "./dashboards/runner-tablet/names";
// import { RTSelection } from "./dashboards/runner-tablet/headset-selection";
import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";
import styles from "./runner-tablet.module.css";

const TABS = {
	NAMES: "names",
	AUDIO: "audio",
	HEADSET_SELECTION: "headset_selection",
} as const;

const RunnerTabletTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#cc7722",
		},
		secondary: {
			main: "#010923",
		},
	},
});

type ObjectValues<T> = T[keyof T];

type TabsValues = ObjectValues<typeof TABS>;

const RunnerTablet: React.FC = () => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const previousDataActive = usePrevious(runDataActiveRep);

	const [tab, setTab] = useState<TabsValues>(TABS.NAMES);
	const [commentatorsRep] = useReplicant("commentators");

	const [live, setLive] = useState(false);

	let currentTabBody = <></>;
	switch (tab) {
		case "names":
			currentTabBody = <RTNames />;
			break;
		case "audio":
			currentTabBody = <RTAudio />;
			break;
		// case "headset_selection":
		// 	currentTabBody = <RTSelection close={() => setTab("names")} />;
		default:
			break;
	}

	// function toggleReady() {
	// 	nodecg.sendMessage(runnerReadyRep ? 'runner:setNotReady' : 'runner:setReady');
	// }

	useListenFor("transition:toGame", () => {
		setLive(true);
	});

	useListenFor("transition:toIntermission", () => {
		setLive(false);
	});

	let buttonText = "ERROR";
	if (live) {
		buttonText = "LIVE";
	} else {
		buttonText = "INTERMISSION";
	}

	useEffect(() => {
		if (!previousDataActive || !runDataActiveRep) return;

		if (runDataActiveRep.id !== previousDataActive.id) {
			setTab(TABS.NAMES);
		}
	}, [previousDataActive, runDataActiveRep]);

	function fullscreen() {
		if (document.fullscreenElement) {
			void document.exitFullscreen();
		} else {
			void document.documentElement.requestFullscreen();
		}
	}

	const host = commentatorsRep?.find((c) => c.id === "host");

	return (
		<ThemeProvider theme={RunnerTabletTheme}>
			<div style={{ height: "100%", width: "100%", fontFamily: "sans-serif" }}>
				<nav className={styles.navBar} style={{ display: tab === TABS.HEADSET_SELECTION ? "none" : "" }}>
					<button className={clsx(styles.navBarButton, tab === "names" && styles.active)} onClick={() => setTab("names")}>
						Names
					</button>
					<button className={clsx(styles.navBarButton, tab === "audio" && styles.active)} onClick={() => setTab("audio")}>
						Audio
					</button>
					<div className={styles.rightSide}>
						<div className={styles.hostName}>
							{/* <span>Host</span> */}
							{/* <br /> */}
							{host?.name}
							<br />
							<span>{host?.pronouns}</span>
						</div>
						<button className={styles.readyButton} onClick={fullscreen} style={{ background: live ? "#0066ff" : "#ff0000" }}>
							{buttonText}
						</button>
					</div>
				</nav>
				<div className={styles.body} style={{ height: tab === TABS.HEADSET_SELECTION ? "100vh" : "" }}>{currentTabBody}</div>
			</div>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<RunnerTablet />);
