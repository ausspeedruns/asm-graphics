import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

import { useReplicant } from "use-nodecg";
import type { ConnectionStatus } from "@asm-graphics/types/Connections";
import { Button } from "@mui/material";

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

export const Status: React.FC = () => {
	const [techReadyRep] = useReplicant<boolean>("tech:ready", false);
	const [x32StatusRep] = useReplicant<ConnectionStatus>("x32:status", "disconnected");
	const [obsStatusRep] = useReplicant<ConnectionStatus>("obs:status", "disconnected");

	const techReadyInfo = connectionStatusStyle(techReadyRep);
	const x32StatusInfo = connectionStatusStyle(x32StatusRep);
	const obsStatusInfo = connectionStatusStyle(obsStatusRep);

	return (
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
		</StatusContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Status />);
