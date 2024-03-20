import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useListenFor, useReplicant } from "use-nodecg";
import { ThemeProvider, createTheme } from "@mui/material";
import usePrevious from "../hooks/usePrevious";

// import type { Timer } from '@asm-graphics/types/Timer';
import type { Commentator } from "@asm-graphics/types/OverlayProps";

import { RTAudio } from "./dashboards/runner-tablet/audio";
import { RTNames } from "./dashboards/runner-tablet/names";
// import { RTSelection } from "./dashboards/runner-tablet/headset-selection";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";

const NavBar = styled.div`
	width: 100%;
	height: 10vh;
	background: var(--orange-500);
	font-family: Verdana, Geneva, Tahoma, sans-serif;
`;

interface NavBarButtonProps {
	active?: boolean;
}

const NavBarButton = styled.button<NavBarButtonProps>`
	height: 100%;
	border: 0;
	border-right: 5px var(--orange-600) solid;
	font-size: 2rem;
	padding: 0 3rem;
	background: ${({ active }) => (active ? "var(--orange-400)" : "var(--orange-500)")};
	transition: 100ms;
`;

const RightSide = styled.div`
	float: right;
	height: 100%;
`;

const HostName = styled.div`
	display: inline-block;
	color: white;
	font-weight: bold;
	text-align: right;
	padding-right: 1rem;
	font-size: 32px;

	span {
		font-weight: normal;
	}
`;

const ReadyButton = styled(NavBarButton)`
	color: #fff;
	float: right;
	border-right: 0;
`;

const Body = styled.div`
	height: 90vh;
`;

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
	const [runDataActiveRep] = useReplicant<RunDataActiveRun | undefined>("runDataActiveRun", undefined, {
		namespace: "nodecg-speedcontrol",
	});
	const previousDataActive = usePrevious(runDataActiveRep);

	const [tab, setTab] = useState<TabsValues>(TABS.NAMES);
	const [host] = useReplicant<Commentator | undefined>("host", undefined);
	// const [runnerReadyRep] = useReplicant<boolean>('runner:ready', false);

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
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
	}

	return (
		<ThemeProvider theme={RunnerTabletTheme}>
			<div style={{ height: "100%", width: "100%", fontFamily: "sans-serif" }}>
				<NavBar style={{ display: tab === TABS.HEADSET_SELECTION ? "none" : "" }}>
					<NavBarButton onClick={() => setTab("names")} active={tab === "names"}>
						Names
					</NavBarButton>
					<NavBarButton onClick={() => setTab("audio")} active={tab === "audio"}>
						Audio
					</NavBarButton>

					<RightSide>
						<HostName>
							{/* <span>Host</span> */}
							{/* <br /> */}
							{host?.name}
							<br />
							<span>{host?.pronouns}</span>
						</HostName>
						<ReadyButton onClick={fullscreen} style={{ background: live ? "#0066ff" : "#ff0000" }}>
							{buttonText}
						</ReadyButton>
					</RightSide>
				</NavBar>
				<Body style={{ height: tab === TABS.HEADSET_SELECTION ? "100vh" : "" }}>{currentTabBody}</Body>
			</div>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<RunnerTablet />);
