import { useEditor, Element } from "@craftjs/core";
import { Button } from "@mui/material";
import { Container } from "../overlays/custom/components/container";
import { RunInfo } from "../overlays/custom/components/run-info";
import { Couch } from "../overlays/custom/components/couch";
import { Facecam } from "../overlays/custom/components/facecam";
import { Sponsors } from "../overlays/custom/components/sponsors";
import { Root } from "../overlays/custom/components/root";
import { Game } from "../overlays/custom/components/game";

function ToolboxItem(props: {
	label: string;
	create: React.ReactElement;
}) {
	const { connectors } = useEditor();

	return (
		<div
			ref={(ref) => {
				if (ref) {
					connectors.create(ref, props.create);
				}
			}}
		>
			<Button variant="outlined" fullWidth>
				{props.label}
			</Button>
		</div>
	);
}

export function Toolbox() {
	return (
		<div>
			<h2>Drag to add</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
				<ToolboxItem
					label="Container"
					create={
						<Element canvas is={Container} direction="vertical" style={{ minHeight: 120, padding: 8 }} />
					}
				/>
				<ToolboxItem label="Run Info" create={<RunInfo type="vertical" />} />
				<ToolboxItem label="Couch" create={<Couch />} />
				<ToolboxItem label="Facecam" create={<Facecam />} />
				<ToolboxItem label="Sponsors" create={<Sponsors height={90} width={320} />} />
				<ToolboxItem
					label="Root"
					create={
						<Element
							canvas
							is={Root}
						>
							<Element canvas is={Container} direction="vertical" style={{ minHeight: 120, padding: 8 }} />
						</Element>
					}
				/>
				<ToolboxItem label="Game" create={<Game aspectRatioWidth={1} aspectRatioHeight={1} />} />
			</div>
		</div>
	);
}