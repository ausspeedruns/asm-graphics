import type { ConnectionStatus } from "@asm-graphics/shared/replicants";
import { CircularProgress } from "@mui/material";

export function ConnectionTag(props: { status?: ConnectionStatus }) {
	const { status } = props;

	const state = status?.status;

	let color = "#888";
	let text = "Disconnected";

	if (state === "connected") {
		color = "#4caf50";
		text = "Connected";
	} else if (state === "connecting") {
		color = "#ff9800";
		text = "Connecting...";
	} else if (state === "error") {
		color = "#f44336";
		text = "Error";
	} else if (state === "warning") {
		color = "#ff9800";
		text = "Warning";
	}

	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				backgroundColor: color,
				color: "#fff",
				padding: "2px 8px",
				borderRadius: 4,
				fontSize: "0.8em",
			}}
		>
			{state === "connecting" && (
				<CircularProgress size={12} style={{ color: "#fff", marginRight: 4 }} />
			)}
			{text}
		</span>
	);
}
