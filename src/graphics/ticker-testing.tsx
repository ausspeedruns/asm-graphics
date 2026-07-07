import { createRoot } from "react-dom/client";

import styles from "./ticker-testing.module.css";

import { Runs } from "./ticker/testing/runs";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Wars } from "./ticker/testing/wars";
import { Goals } from "./ticker/testing/goals";
import { CTA } from "./ticker/testing/cta";
import { Prizes } from "./ticker/testing/prizes";
import { Milestone } from "./ticker/testing/milestone";
import { DonationMatches } from "./ticker/testing/donation-matches";

const BACKGROUND_OPTIONS = [
	{ label: "Grey", value: "#6b7280" },
	{ label: "Red", value: "#b91c1c" },
	{ label: "Green", value: "#166534" },
	{ label: "Blue", value: "#1d4ed8" },
	{ label: "Black", value: "#111827" },
] as const;

const DEFAULT_FONT = "Arial, sans-serif";
const TEST_FONT = "Courier New, monospace";

function TickerTesting() {
	const [backgroundColour, setBackgroundColour] = useState("#6b7280");
	const [font, setFont] = useState(DEFAULT_FONT);

	useEffect(() => {
		document.body.style.backgroundColor = "#f3efe7";
	}, []);

	return (
		<div className={styles.container} style={{ fontFamily: font }}>
			<header className={styles.hero}>
				<h1>Ticker Testing</h1>
			</header>
			<section className={styles.panel}>
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
			</section>
			<Runs showcaseBackgroundColour={backgroundColour} />
			<Wars showcaseBackgroundColour={backgroundColour} />
			<Goals showcaseBackgroundColour={backgroundColour} />
			<CTA showcaseBackgroundColour={backgroundColour} />
			<Prizes showcaseBackgroundColour={backgroundColour} />
			<Milestone showcaseBackgroundColour={backgroundColour} />
			<DonationMatches showcaseBackgroundColour={backgroundColour} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<TickerTesting />);
