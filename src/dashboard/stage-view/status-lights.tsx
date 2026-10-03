import { IconButton, Tooltip } from "@mui/material";
import { useReplicant } from "@nodecg/react-hooks";

import styles from "./status-lights.module.css";
import type { ConnectionStatus } from "@asm-graphics/shared/replicants.js";
import { NetworkCheck, WarningAmber } from "@mui/icons-material";

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
			{status.recentIssues.length > 0 && (
				<div style={{ marginTop: "8px", fontSize: "0.8em" }}>
					<strong>Recent issues</strong>
					{status.recentIssues.map((issue) => (
						<div key={issue.timestamp}>
							{new Date(issue.timestamp).toLocaleTimeString()} [{issue.status}] {issue.message}
							{issue.count > 1 && ` (×${issue.count})`}
						</div>
					))}
					<div style={{ marginTop: "4px", color: "#888" }}>Click the warning icon to clear.</div>
				</div>
			)}
		</div>
	);
}

export function StatusLights() {
	const [networkTestRep] = useReplicant("network-test");

	return (
		<div className={styles.container}>
			<ConnectionStatusLight label="OBS" replicant="obs:status" />
			{/* <StatusLight label="Livestream" tooltipText="Connected to the server" status="connected" /> */}
			<ConnectionStatusLight label="X32" replicant="x32:status" />
			<ConnectionStatusLight label="Tiltify" replicant="tiltify:status" />
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

interface ConnectionStatusLightProps {
	label: string;
	replicant: "obs:status" | "x32:status" | "tiltify:status";
}

function ConnectionStatusLight(props: ConnectionStatusLightProps) {
	const [statusRep, setStatusRep] = useReplicant(props.replicant);
	const issueCount = statusRep?.recentIssues.length ?? 0;

	return (
		<StatusLight label={props.label} tooltipText={generateTooltipText(statusRep)} status={statusRep?.status}>
			{statusRep && issueCount > 0 && (
				<IconButton
					size="small"
					color="inherit"
					aria-label={`Clear ${issueCount} recent ${props.label} issues`}
					onClick={() => setStatusRep({ ...statusRep, recentIssues: [] })}
					sx={{ ml: 0.5, p: 0.25 }}
				>
					<WarningAmber fontSize="inherit" />
					<span style={{ fontSize: "0.75em", marginLeft: 2 }}>{issueCount}</span>
				</IconButton>
			)}
		</StatusLight>
	);
}

interface StatusLightProps {
	label: string;
	tooltipText: React.ReactNode;
	status?: ConnectionStatus["status"];
	children?: React.ReactNode;
}

function StatusLight(props: StatusLightProps) {
	return (
		<Tooltip title={props.tooltipText} arrow>
			<div className={styles.statusIndicator} data-status={props.status ?? "connecting"}>
				{props.label}
				{props.children}
			</div>
		</Tooltip>
	);
}
