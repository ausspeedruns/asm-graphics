import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { useReplicant } from "use-nodecg";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";
import { Accordion, AccordionDetails, AccordionSummary, Button, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";

const StatusContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const ConnectionStatus = styled.div`
	height: 2rem;
	color: white;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
`;

const Header = styled.h3<HeaderProps>`
	text-align: center;
	padding-top: ${({ noBorder }) => (noBorder ? "" : "1rem")};
	margin: 0;
`;

interface HeaderProps {
	noBorder?: boolean;
}

function connectionStatusStyle(status: ConnectionStatus | boolean): { text: string; colour: string } {
	switch (status) {
		case "disconnected":
			return { text: "Disconnected", colour: "#757575" };
		case "connected":
			return { text: "Connected", colour: "#4CAF50" };
		case "error":
			return { text: "Error", colour: "#D32F2F" };
		case "warning":
			return { text: "Missed Heartbeat", colour: "#FF9800" };
		case true:
			return { text: "READY", colour: "#4CAF50" };
		case false:
			return { text: "NOT READY", colour: "#D32F2F" };
		default:
			return { text: status, colour: "#ff008c" };
	}
}

// Duplicate function in obs-local.ts I know I'm a bad boy
function determineSceneType(scene: string) {
	if (scene.startsWith("GAMEPLAY")) {
		return "Gameplay";
	} else if (scene.startsWith("INTERMISSION")) {
		return "Intermission";
	} else if (scene.startsWith("IRL")) {
		return "IRL";
	} else if (scene.startsWith("ASNN")) {
		return "ASNN";
	} else {
		return "Unknown";
	}
}

export const Status: React.FC = () => {
	const [techReadyRep] = useReplicant<boolean>("tech:ready", false);
	const [x32StatusRep] = useReplicant<ConnectionStatus>("x32:status", "disconnected");
	const [obsStatusRep] = useReplicant<ConnectionStatus>("obs:status", "disconnected");
	const [obsCurrentSceneRep] = useReplicant<string>("obs:currentScene", "disconnected");

	const techReadyInfo = connectionStatusStyle(techReadyRep);
	const x32StatusInfo = connectionStatusStyle(x32StatusRep);
	const obsStatusInfo = connectionStatusStyle(obsStatusRep);

	const sceneType = determineSceneType(obsCurrentSceneRep);

	let automationPanel = <></>;
	switch (sceneType) {
		case "Gameplay":
			automationPanel = <CurrentGameplayAutomations />;
			break;
		case "Intermission":
			automationPanel = <CurrentIntermissionAutomations />;
			break;
		case "IRL":
		case "ASNN":
		case "Unknown":
		default:
			automationPanel = (
				<Accordion>
					<AccordionSummary>Going to anything</AccordionSummary>
					<AccordionDetails>
						<ul>
							<li>Run Transition Graphic</li>
						</ul>
					</AccordionDetails>
				</Accordion>
			);
			break;
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<StatusContainer>
				<Header noBorder>Tech</Header>
				<ConnectionStatus style={{ backgroundColor: techReadyInfo.colour }}>
					{techReadyInfo.text}
				</ConnectionStatus>
				<div style={{ display: "flex" }}>
					<Button variant="contained" onClick={() => nodecg.sendMessage("tech:setNotReady")} fullWidth>
						Unready
					</Button>
					<Button variant="contained" onClick={() => nodecg.sendMessage("tech:setReady")} fullWidth>
						Ready
					</Button>
				</div>
				<Header>OBS</Header>
				<ConnectionStatus style={{ backgroundColor: obsStatusInfo.colour }}>
					{obsStatusInfo.text}
				</ConnectionStatus>
				<Header>X32</Header>
				<ConnectionStatus style={{ backgroundColor: x32StatusInfo.colour }}>
					{x32StatusInfo.text}
				</ConnectionStatus>
				<Header>Automations</Header>
				<h3>Current Scene Type</h3>
				<h4>{sceneType === "Unknown" ? obsCurrentSceneRep : sceneType}</h4>
				<section>{automationPanel}</section>
			</StatusContainer>
		</ThemeProvider>
	);
};

const CurrentGameplayAutomations = () => {
	return (
		<>
			<Accordion>
				<AccordionSummary>Going to Intermission</AccordionSummary>
				<AccordionDetails>
					<ul>
						<li>Advance run</li>
						<li>Reset Runner and Tech status</li>
						<li>Mute ALL channels on Stream and Speakers except Host</li>
						<li>Unmute Host on Stream and Speakers?????</li>
						<li>Run Transition Graphic</li>
					</ul>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary>Going to another Gameplay</AccordionSummary>
				<AccordionDetails>
					<p>Nothing.</p>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary>Going to IRL</AccordionSummary>
				<AccordionDetails>
					<ul>
						<li>Mute all audio inputs on Stream and Speakers</li>
						<li>Unmute "Special Mic" (Channel 6) on Stream and Speakers</li>
						<li>Run Transition Graphic</li>
					</ul>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary>Going to Other</AccordionSummary>
				<AccordionDetails>
					<ul>
						<li>Run Transition Graphic</li>
					</ul>
				</AccordionDetails>
			</Accordion>
		</>
	);
};

const CurrentIntermissionAutomations = () => {
	return (
		<>
			<Accordion>
				<AccordionSummary>Going to Gameplay</AccordionSummary>
				<AccordionDetails>
					<li>Unmute mics that have a Runner / Commentator assigned on Stream and Speakers</li>
					<li>Run Transition Graphic</li>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary>Going to another Intermission</AccordionSummary>
				<AccordionDetails>
					<p>Nothing.</p>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary>Going to IRL</AccordionSummary>
				<AccordionDetails>
					<ul>
						<li>Mute all audio inputs on Stream and Speakers</li>
						<li>Unmute "Special Mic" (Channel 6) on Stream and Speakers</li>
						<li>Run Transition Graphic</li>
					</ul>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary>Going to Other</AccordionSummary>
				<AccordionDetails>
					<ul>
						<li>Run Transition Graphic</li>
					</ul>
				</AccordionDetails>
			</Accordion>
		</>
	);
};

createRoot(document.getElementById("root")!).render(<Status />);
