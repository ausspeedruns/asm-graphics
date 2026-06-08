import { useEditor } from "@craftjs/core";
import { Button } from "@mui/material";

export function SettingsPanel() {
	const { selectedNodeId, selectedNodeName, canDelete, selectedNode, actions } = useEditor((state) => {
		const selected = Array.from(state.events.selected);
		const selectedNodeId = selected.length > 0 ? selected[0] : null;
		const selectedNode = selectedNodeId ? state.nodes[selectedNodeId] : null;

		return {
			selectedNodeId,
			selectedNode,
			selectedNodeName: selectedNode?.data.name,
			canDelete: Boolean(selectedNodeId && selectedNodeId !== "ROOT"),
		};
	});

	const SettingsComponent = selectedNode?.related["settings"] as React.ComponentType | undefined;

	return (
		<div
			style={{
				border: "1px solid #cbd5e1",
				borderRadius: "0.5rem",
				padding: "1rem",
				backgroundColor: "#f8fafc",
				minWidth: 300,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					gap: "1rem",
				}}
			>
				<div style={{ flex: 1 }}>
					<h2
						style={{
							margin: "0 0 0.5rem 0",
							fontSize: "1.1rem",
							fontWeight: 700,
							letterSpacing: "0.01em",
							color: "#0f172a",
						}}
					>
						Selected
					</h2>
					<div style={{ color: "#475569", fontSize: "0.875rem" }}>
						<strong style={{ color: "#0f172a" }}>{selectedNodeName ?? "Nothing selected"}</strong>
					</div>
				</div>
				<div
					style={{
						flex: 1,
						minHeight: "2rem",
						paddingTop: "0.25rem",
						display: "flex",
						flexDirection: "column",
						gap: "0.75rem",
					}}
				>
					{SettingsComponent && <SettingsComponent />}
				</div>
				<Button
					disabled={!canDelete}
					onClick={() => selectedNodeId && actions.delete(selectedNodeId)}
					variant="contained"
					color="error"
					size="small"
					sx={{ alignSelf: "flex-start", fontWeight: 700, letterSpacing: "0.02em", px: 1.5 }}
				>
					Delete
				</Button>
			</div>
		</div>
	);
}
