import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import styles from "./ticker-testing.module.css";

import { Button, Slider, Stack } from "@mui/material";
import { Goals } from "./intermission/incentives/testing/goals";
import { Wars } from "./intermission/incentives/testing/wars";
import { Runs } from "./intermission/incentives/testing/upcoming-runs";
import { PrizesTesting } from "./intermission/incentives/testing/prizes";

const BACKGROUND_OPTIONS = [
	{ label: "Grey", value: "#6b7280" },
	{ label: "Red", value: "#b91c1c" },
	{ label: "Green", value: "#166534" },
	{ label: "Blue", value: "#1d4ed8" },
	{ label: "Black", value: "#111827" },
] as const;

const DEFAULT_FONT = "Arial, sans-serif";
const TEST_FONT = "Courier New, monospace";

function IntermissionCarouselTesting() {
	const [backgroundColour, setBackgroundColour] = useState("#6b7280");
	const [font, setFont] = useState(DEFAULT_FONT);
	const [height, setHeight] = useState(235);
	const [width, setWidth] = useState(780);

	useEffect(() => {
		document.body.style.backgroundColor = "#f3efe7";
	}, []);

	return (
		<div className={styles.container} style={{ fontFamily: font }}>
			<header className={styles.hero}>
				<h1>Intermission Carousel Testing</h1>
			</header>
			<section className={styles.controls}>
				<h2>Showcase Background</h2>
				<Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
					{BACKGROUND_OPTIONS.map((option) => (
						<Button
							key={option.value}
							variant={backgroundColour === option.value ? "contained" : "outlined"}
							onClick={() => setBackgroundColour(option.value)}
						>
							{option.label}
						</Button>
					))}
					<Button variant="text" onClick={() => setBackgroundColour("")}>
						Reset
					</Button>
				</Stack>
				<hr />
				<Button
					variant="text"
					onPointerDown={() => setFont(TEST_FONT)}
					onPointerUp={() => setFont(DEFAULT_FONT)}
					onPointerLeave={() => setFont(DEFAULT_FONT)}
					onPointerCancel={() => setFont(DEFAULT_FONT)}
				>
					Font Checker
				</Button>
				<hr />
				<span>Height: {height}px</span>
				<Slider
					value={height}
					onChange={(_, newValue) => setHeight(newValue as number)}
					min={0}
					max={1000}
					step={1}
					valueLabelDisplay="auto"
				/>
				<span>Width: {width}px</span>
				<Slider
					value={width}
					onChange={(_, newValue) => setWidth(newValue as number)}
					min={0}
					max={1000}
					step={1}
					valueLabelDisplay="auto"
				/>
			</section>
			<Goals showcaseBackgroundColour={backgroundColour} showcaseHeight={height} showcaseWidth={width} />
			<Wars showcaseBackgroundColour={backgroundColour} showcaseHeight={height} showcaseWidth={width} />
			<Runs showcaseBackgroundColour={backgroundColour} showcaseHeight={height} showcaseWidth={width} />
			<PrizesTesting showcaseBackgroundColour={backgroundColour} showcaseHeight={height} showcaseWidth={width} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<IntermissionCarouselTesting />);
