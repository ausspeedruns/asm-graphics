import { useEditor } from "@craftjs/core";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useEditorDevStore } from "../stores/editor-dev-store";

export function Topbar() {
	const { query } = useEditor();
	const devMode = useEditorDevStore((state) => state.devMode);
	const setDevMode = useEditorDevStore((state) => state.setDevMode);

	function handleSerialize() {
		const serialized = query.serialize();
		console.log("CraftJS serialized tree:", serialized);
	}

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				padding: "0.5rem 1rem",
			}}
		>
			<Button size="small" variant="outlined" color="secondary" onClick={handleSerialize}>
				Serialize JSON to console
			</Button>

			<FormControlLabel
				control={<Switch color="primary" checked={devMode} onChange={(_, checked) => setDevMode(checked)} />}
				label="Dev Mode"
				labelPlacement="start"
			/>
		</div>
	);
}
