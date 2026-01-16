import { Tooltip } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

import styles from "./status-lights.module.css";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";

function GenerateTooltipText(status?: ConnectionStatus) {
	if (!status) {
		return "NodeCG Connecting...";
	}

	if (!status.message) {
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

	return (
		<div className={styles.container}>
			<StatusLight label="OBS" tooltipText={GenerateTooltipText(obsStatusRep)} status={obsStatusRep?.status} />
			{/* <StatusLight label="Livestream" tooltipText="Connected to the server" status="connected" /> */}
			<StatusLight label="X32" tooltipText={GenerateTooltipText(x32StatusRep)} status={x32StatusRep?.status} />
			<StatusLight label="Tiltify" tooltipText={GenerateTooltipText(tiltifyStatusRep)} status={tiltifyStatusRep?.status} />
		</div>
	);
}

interface StatusLightProps {
	label: string;
	tooltipText: React.ReactNode;
	status?: ConnectionStatus['status'];
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
