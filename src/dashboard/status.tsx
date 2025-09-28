import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { FormControlLabel, Switch, ThemeProvider } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

import { darkTheme } from "./theme";

import type { ConnectionStatus } from "@asm-graphics/types/Connections";
import type { Automations } from "@asm-graphics/types/Automations";

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
	const [x32StatusRep] = useReplicant<ConnectionStatus>("x32:status");
	const [obsStatusRep] = useReplicant<ConnectionStatus>("obs:status");
	const [automationsRep, setAutomationsRep] = useReplicant<Automations>("automations");

	const x32StatusInfo = connectionStatusStyle(x32StatusRep ?? "disconnected");
	const obsStatusInfo = connectionStatusStyle(obsStatusRep ?? "disconnected");

	function handleSwitchChange(type: keyof Automations) {
		return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
			setAutomationsRep({
				runAdvance: type === "runAdvance" ? checked : (automationsRep?.runAdvance ?? false),
				runTransition: type === "runTransition" ? checked : (automationsRep?.runTransition ?? false),
				audioMixing: type === "audioMixing" ? checked : (automationsRep?.audioMixing ?? false),
				clearCommentators: type === "clearCommentators" ? checked : (automationsRep?.clearCommentators ?? false),
			});
		};
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<StatusContainer>
				<Header>OBS</Header>
				<ConnectionStatus style={{ backgroundColor: obsStatusInfo.colour }}>
					{obsStatusInfo.text}
				</ConnectionStatus>
				<Header>X32</Header>
				<ConnectionStatus style={{ backgroundColor: x32StatusInfo.colour }}>
					{x32StatusInfo.text}
				</ConnectionStatus>
				<Header>Automations</Header>
				<AutomationSwitch
					label="Auto Advance Run"
					checked={automationsRep?.runAdvance}
					onChange={handleSwitchChange("runAdvance")}
				/>
				<AutomationSwitch
					label="Run Transition"
					checked={automationsRep?.runTransition}
					onChange={handleSwitchChange("runTransition")}
				/>
				<AutomationSwitch
					label="Auto Audio Mixing"
					checked={automationsRep?.audioMixing}
					onChange={handleSwitchChange("audioMixing")}
				/>
				<AutomationSwitch
					label="Clear Commentators"
					checked={automationsRep?.clearCommentators}
					onChange={handleSwitchChange("clearCommentators")}
				/>
			</StatusContainer>
		</ThemeProvider>
	);
};

const AutomationSwitch = ({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked?: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}) => (
	<FormControlLabel
		value="start"
		control={<Switch color="primary" checked={checked} onChange={onChange} />}
		label={label}
		labelPlacement="start"
	/>
);

createRoot(document.getElementById("root")!).render(<Status />);
