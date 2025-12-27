import type { ConnectionStatus } from "@asm-graphics/types/Connections";
import { CircularProgress } from "@mui/material";

export function ConnectionTag(props: { status?: ConnectionStatus }) {
	const { status } = props;

	let color = "#888";
	let text = "Disconnected";

	if (status === "connected") {
		color = "#4caf50";
		text = "Connected";
	} else if (status === "connecting") {
		color = "#ff9800";
		text = "Connecting...";
	} else if (status === "error") {
		color = "#f44336";
		text = "Error";
	} else if (status === "warning") {
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
			{status === "connecting" && (
				<CircularProgress size={12} style={{ color: "#fff", marginRight: 4 }} />
			)}
			{text}
		</span>
	);
}
