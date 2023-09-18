import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

// import useCurrentTime from "../hooks/useCurrentTime";
// import useSurroundingRuns from "../hooks/useSurroundingRuns";
import { useReplicant } from "use-nodecg";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";
import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material";

const StatusContainer = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr;
`;

const Column = styled.div``;

// const TimeToNextContainer = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	align-items: center;
// 	margin-bottom: 1rem;
// `;

// const Time = styled.span`
// 	font-size: 4rem;
// `;

const ConnectionStatus = styled.div`
	height: 4rem;
	color: white;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
`;

const Header = styled.h1<HeaderProps>`
	text-align: center;
	border-top: ${({ noBorder }) => (noBorder ? "" : "1px solid white")};
	padding-top: ${({ noBorder }) => (noBorder ? "" : "1rem")};
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

// function durationToTime(duration?: number) {
// 	if (!duration) return "--:--:--";

// 	const durationDate = new Date(duration);

// 	return `${duration < 0 ? "-" : ""}${durationDate.getHours()}:${durationDate.getMinutes()?.toLocaleString("en-AU", {
// 		minimumIntegerDigits: 2,
// 	})}:${durationDate.getSeconds()?.toLocaleString("en-AU", { minimumIntegerDigits: 2 })}`;
// }

// function timeColour(duration?: number) {
// 	if (!duration) return "rgba(255, 255, 255, 0.5)";

// 	if (duration <= 60 * 1000) {
// 		// Below 1 min / late
// 		return "#FF0000";
// 	} else if (duration <= 15 * 60 * 1000) {
// 		// Within 15 mins
// 		return "#90ff90";
// 	} else if (duration <= 30 * 60 * 1000) {
// 		// Within 30 mins
// 		return "#8a8aff";
// 	}

// 	return "#FFFFFF";
// }

export const Status: React.FC = () => {
	// const currentTime = useCurrentTime();
	// const currentTime = new Date('2024-09-23');
	// const [_, currentRun, nextRun] = useSurroundingRuns();
	// const [runnerReadyRep] = useReplicant<boolean>('runner:ready', false);
	const [techReadyRep] = useReplicant<boolean>("tech:ready", false);
	const [x32StatusRep] = useReplicant<ConnectionStatus>("x32:status", "disconnected");
	const [obsStatusRep] = useReplicant<ConnectionStatus>("obs:status", "disconnected");

	const techReadyInfo = connectionStatusStyle(techReadyRep);
	// const runnerReadyInfo = connectionStatusStyle(runnerReadyRep);
	const x32StatusInfo = connectionStatusStyle(x32StatusRep);
	const obsStatusInfo = connectionStatusStyle(obsStatusRep);

	// const timeToCurrentRunStart = new Date(currentRun?.scheduled ?? 0).getTime() - currentTime.getTime();
	// const timeToCurrentRunEnd =
	// 	new Date(((currentRun?.scheduledS ?? 0) + (currentRun?.estimateS ?? 0)) * 1000 ?? 0).getTime() -
	// 	currentTime.getTime();
	// const timeToNextRunStart = new Date(nextRun?.scheduled ?? 0).getTime() - currentTime.getTime();

	return (
		<StatusContainer>
			<Column>
				{/* <Header noBorder>TIME</Header> */}
				{/* <TimeToNextContainer>
					Currently
					<Time>{new Date().toLocaleTimeString()}</Time>
				</TimeToNextContainer> */}
				<FormGroup>
					<FormLabel>Setup</FormLabel>
					<FormControlLabel control={<Checkbox />} label="Console plugged in" />
					<FormControlLabel control={<Checkbox />} label="Controllers plugged in" />
					<FormControlLabel control={<Checkbox />} label="Video in OBS" />
					<FormControlLabel control={<Checkbox />} label="Video cropped" />
					<FormControlLabel control={<Checkbox />} label="Disabled" />
				</FormGroup>
				{/* <TimeToNextContainer>
					Time until current run starts{' '}
					<Time style={{ color: timeColour(timeToCurrentRunStart) }}>
						{durationToTime(timeToCurrentRunStart)}
					</Time>
				</TimeToNextContainer>
				<TimeToNextContainer>
					Time until run finish{' '}
					<Time style={{ color: timeColour(timeToCurrentRunEnd) }}>
						{durationToTime(timeToCurrentRunEnd)}
					</Time>
				</TimeToNextContainer>
				<TimeToNextContainer>
					Time until next run{' '}
					<Time style={{ color: timeColour(timeToNextRunStart) }}>{durationToTime(timeToNextRunStart)}</Time>
				</TimeToNextContainer> */}
			</Column>
			<Column>
				<Header noBorder>Runner</Header>
				{/* <ConnectionStatus style={{ backgroundColor: runnerReadyInfo.colour }}>
					{runnerReadyInfo.text}
				</ConnectionStatus> */}
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
			</Column>
		</StatusContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Status />);
