import { createRoot } from "react-dom/client";
import { Editor, Element, Frame } from "@craftjs/core";
import { Topbar } from "./overlay-creator/top-bar";
import { Root } from "./overlays/custom/components/root";
import { Toolbox } from "./overlay-creator/toolbox";
import { SettingsPanel } from "./overlay-creator/settings";
import { Container } from "./overlays/custom/components/container";
import { Facecam } from "./overlays/custom/components/facecam";
import { Sponsors } from "./overlays/custom/components/sponsors";
import { RunInfo } from "./overlays/custom/components/run-info";
import { Game } from "./overlays/custom/components/game";
import { Couch } from "./overlays/custom/components/couch";
import { StyleSettings } from "./overlay-creator/style-settings";

export function OverlayEditor() {
	return (
		<div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
			<h1>Overlay Editor</h1>
			<Editor resolver={{ Root, Container, Facecam, Sponsors, RunInfo, Game, Couch }}>
				<Topbar />
				<div style={{ display: "flex", gap: "1rem" }}>
					<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 320 }}>
						<Toolbox />
						<SettingsPanel />
						{/* <StyleSettings /> */}
					</div>
					<Frame>
						<Element canvas is={Root}>
							<Element canvas is={Container}>
								<Element canvas is={Container} style={{ flexDirection: "column", flexGrow: 0 }}>
									<Facecam height={352} />
								</Element>
								<Element
									canvas
									is={Container}
									style={{
										flexDirection: "column",
										flexGrow: 1,
										justifyContent: "space-evenly",
										alignItems: "center",
									}}
								>
									<Couch direction="horizontal" />
									<RunInfo type="vertical" />
									<Sponsors height={90} width={360} />
								</Element>
							</Element>
							<Game aspectRatioWidth={4} aspectRatioHeight={3} />
						</Element>
					</Frame>
				</div>
			</Editor>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<OverlayEditor />);
