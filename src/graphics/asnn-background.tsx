import { createRoot } from "react-dom/client";
import { Circuitry } from "./overlays/asm25/circuitry";
import { dayTimeColours } from "./elements/useTimeColour";

function ASNNBackground() {
	return (
		<div
			style={
				{
					width: 1920,
					height: 1080,
					position: "relative",
					"--plastic-top": dayTimeColours.plasticTop + "5C",
					"--plastic-bottom": dayTimeColours.plasticBottom,
					"--text-outline": dayTimeColours.textOutline,
					"--trace": dayTimeColours.trace,
					"--trace-outline": dayTimeColours.traceOutline,
					"--chip": dayTimeColours.chip,
				} as React.CSSProperties
			}
		>
			<Circuitry bigShadowAngle={90} style={{ position: "absolute", width: "100%", height: "100%" }} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<ASNNBackground />);
