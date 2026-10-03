import { IconButton, Tooltip } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

import styles from "./status-lights.module.css";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";
import { NetworkCheck } from "@mui/icons-material";

function generateTooltipText(status?: ConnectionStatus) {
	if (!status) {
		return "NodeCG Connecting...";
	}

	if (!status.message) {
		if (status.status === "disconnected") {
			return "Disconnected";
		}

		return "No additional information.";
	}

	const time = new Date(status.timestamp);
	return (
		<div>
			<div>{status.message}</div>
			<div style={{ marginTop: "8px", fontSize: "0.8em", color: "#888" }}>
				Last updated: {time.toLocaleString()}
			</div>
		</div>
	);
}

export function StatusLights() {
	const [obsStatusRep] = useReplicant("obs:status");
	const [x32StatusRep] = useReplicant("x32:status");
	const [tiltifyStatusRep] = useReplicant("tiltify:status");
	const [networkTestRep] = useReplicant("network-test");

	return (
		<div className={styles.container}>
			<StatusLight label="OBS" tooltipText={generateTooltipText(obsStatusRep)} status={obsStatusRep?.status} />
			{/* <StatusLight label="Livestream" tooltipText="Connected to the server" status="connected" /> */}
			<StatusLight label="X32" tooltipText={generateTooltipText(x32StatusRep)} status={x32StatusRep?.status} />
			<StatusLight
				label="Tiltify"
				tooltipText={generateTooltipText(tiltifyStatusRep)}
				status={tiltifyStatusRep?.status}
			/>
			<StatusLight
				label="Twitch and Youtube Reachable"
				tooltipText={`Twitch: ${networkTestRep?.twitch ? "Connected" : "Disconnected"}, YouTube: ${networkTestRep?.youtube ? "Connected" : "Disconnected"} | Last updated: ${networkTestRep?.timestamp ? new Date(networkTestRep.timestamp).toLocaleString() : "N/A"}`}
				status={networkTestRep?.twitch && networkTestRep?.youtube ? "connected" : "disconnected"}
			/>
			<Tooltip title="Start Network Reachability Test" arrow>
				<IconButton onClick={() => nodecg.sendMessage("network-test:start")}>
					<NetworkCheck />
				</IconButton>
			</Tooltip>
		</div>
	);
}

interface StatusLightProps {
	label: string;
	tooltipText: React.ReactNode;
	status?: ConnectionStatus["status"];
}

function StatusLight(props: StatusLightProps) {
	return (
		<Tooltip title={props.tooltipText} arrow>
			<div className={styles.statusIndicator} data-status={props.status ?? "connecting"}>
				{props.label}
			</div>
		</Tooltip>
	);
}
