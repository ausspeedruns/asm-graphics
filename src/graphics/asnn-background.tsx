import { createRoot } from "react-dom/client";
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
		></div>
	);
}

createRoot(document.getElementById("root")!).render(<ASNNBackground />);
