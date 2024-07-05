import { createRoot } from "react-dom/client";
import { SceneHill } from "./elements/event-specific/asm-24/scene-hill";
import { useState } from "react";
import { sunriseEnd, sunriseStart, sunsetEnd, sunsetStart } from "./elements/event-specific/asm-24/time-utils";

// Convert a decimal time to a 12-hour time string where 0 is 12PM and 0.5 is 12AM
function convertTo12Hour(time: number) {
	const hour = Math.floor(time * 24);
	const minute = Math.floor((time * 24 - hour) * 60);
	const hour12 = (hour + 12) % 12 || 12;
	const minuteStr = minute.toString().padStart(2, "0");
	return `${hour12.toString().padStart(2, "0")}:${minuteStr.padStart(2, "0")} ${hour < 12 ? "PM" : "AM"}`;
}

const ASM24Hill: React.FC = () => {
	const [time, setTime] = useState(0);
	const [seed, setSeed] = useState(0);
	// const [trees, setTrees] = useState(20);
	const [colours, setColours] = useState<{ stop: number; colour: string }[]>([
		{ stop: 0, colour: "#f00" },
		{ stop: 1, colour: "#0f0" },
		{ stop: 1, colour: "#0f0" },
		{ stop: 1, colour: "#0f0" },
	]);

	return (
		<div style={{ position: "absolute", height: "100%", width: "100%" }}>
			<SceneHill seed={seed} trees={50} time={time} testSkyColours={colours} />
			<div style={{ position: "absolute", top: 0 }}>
				Time {convertTo12Hour(time)}
				<input
					type="range"
					min={0}
					max={1}
					value={time}
					step={0.001}
					onChange={(e) => setTime(e.target.valueAsNumber)}
					style={{ width: 500 }}
				/>
				<button onClick={() => setTime(0)}>Midday</button>
				<button onClick={() => setTime((sunsetStart + sunsetEnd) / 2)}>Sunset</button>
				<button onClick={() => setTime(0.5)}>Midnight</button>
				<button onClick={() => setTime((sunriseStart + sunriseEnd) / 2)}>Sunrise</button>
				<br />
				Seed {seed}
				<input type="range" min={0} max={1000} value={seed} onChange={(e) => setSeed(e.target.valueAsNumber)} />
				{/* Trees {trees}
				<input
					type="range"
					min={0}
					max={100}
					value={trees}
					onChange={(e) => setTrees(e.target.valueAsNumber)}
				/> */}
				<br />
				Colours
				{colours.map((colour, i) => (
					<div key={i}>
						<input
							type="color"
							value={colour.colour}
							onChange={(e) => {
								const updatedColours = [...colours];
								updatedColours[i].colour = e.target.value;
								setColours(updatedColours);
							}}
						/>
						{colour.colour}
						<input
							type="range"
							min={i == 0 ? 0 : colours[i - 1].stop}
							max={i == colours.length - 1 ? 1 : colours[i + 1].stop}
							step={0.001}
							value={colour.stop}
							onChange={(e) => {
								const updatedColours = [...colours];
								updatedColours[i].stop = parseFloat(e.target.value);
								setColours(updatedColours);
							}}
						/>
						{colour.stop.toFixed(3)}
					</div>
				))}
			</div>
		</div>
	);
};

createRoot(document.getElementById("root")!).render(<ASM24Hill />);
