import { useListenFor } from "@nodecg/react-hooks";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { Timer } from "./elements/timer";
import type { Timer as TimerType } from "@asm-graphics/types/Timer";

import ASM2015 from "./overlays/asm25/countdown/ASM2015.png";
import ASM2016 from "./overlays/asm25/countdown/ASM2016.png";
import ASM2017 from "./overlays/asm25/countdown/ASM2017.png";
import ASM2018 from "./overlays/asm25/countdown/ASM2018.png";
import ASM2019 from "./overlays/asm25/countdown/ASM2019.png";
import ASM2020 from "./overlays/asm25/countdown/ASM2020.png";
import ASM2021 from "./overlays/asm25/countdown/ASM2021.png";
import ASM2022 from "./overlays/asm25/countdown/ASM2022.png";
import ASM2023 from "./overlays/asm25/countdown/ASM2023.png";
import ASM2024 from "./overlays/asm25/countdown/ASM2024.png";
import { Circuitry } from "./overlays/asm25/circuitry";
import { dayTimeColours } from "./elements/useTimeColour";

const EventImage = styled.img`
	position: absolute;
	height: 1080px;
	width: 1920px;

	transition: opacity 5s ease-in-out;
`;

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const baseTimer: TimerType = {
	time: "00:15:00",
	state: "stopped",
	milliseconds: 0,
	timestamp: Date.now(),
	teamFinishTimes: {},
};

function createTimerData(endTime: number): TimerType {
	const currentTime = Date.now();
	const elapsed = endTime - currentTime;
	const seconds = Math.floor(elapsed / 1000);
	const formattedTime = formatTime(seconds);
	return {
		...baseTimer,
		time: formattedTime,
		state: "running",
		milliseconds: elapsed,
		timestamp: currentTime,
	};
}

// ASM2015 = 0
// ASM2016 = 1
// ASM2017 = 2
// ASM2018 = 3
// ASM2019 = 4
// ASM2020 = 5
// ASM2021 = 6
// ASM2022 = 7
// ASM2023 = 8
// ASM2024 = 9
// ASM2025 = 10

export function Countdown() {
	const [endTime, setEndTime] = useState<number | null>(null);
	const [timerData, setTimerData] = useState(baseTimer);

	const [eventNumber, setEventNumber] = useState<number>(0);

	useEffect(() => {
		if (endTime === null) {
			return;
		}

		const interval = setInterval(() => {
			if (endTime) {
				const timerData = createTimerData(endTime);
				setTimerData(timerData);

				// Get minutes from the timer data
				const minutes = Math.floor(timerData.milliseconds / 60000);

				setEventNumber(Math.max(0, 10 - minutes));
			}
		}, 50);

		return () => clearInterval(interval);
	}, [endTime]);

	useListenFor("countdown:start", (time) => {
		const [hours, minutes, seconds] = time.split(":").map(Number);
		const parsedTimer = Date.now() + (hours * 3600 + minutes * 60 + seconds) * 1000;
		setEndTime(parsedTimer);
	});

	useListenFor("countdown:stop", () => {
		setEndTime(null);
	});

	return (
		<div
			style={
				{
					height: 1080,
					width: 1920,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					"--plastic-top": dayTimeColours.plasticTop + "5C",
					"--plastic-bottom": dayTimeColours.plasticBottom,
					"--text-outline": dayTimeColours.textOutline,
					"--trace": dayTimeColours.trace,
					"--trace-outline": dayTimeColours.traceOutline,
					"--chip": dayTimeColours.chip,
				} as React.CSSProperties
			}>
			<div style={{ opacity: eventNumber <= 10 ? 1 : 0, width: 1920, height: 1080, position: "absolute" }}>
				<Circuitry bigShadowAngle={90} style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }} />
			</div>
			<EventImage src={ASM2024} style={{ opacity: eventNumber <= 9 ? 1 : 0 }} />
			<EventImage src={ASM2023} style={{ opacity: eventNumber <= 8 ? 1 : 0 }} />
			<EventImage src={ASM2022} style={{ opacity: eventNumber <= 7 ? 1 : 0 }} />
			<EventImage src={ASM2021} style={{ opacity: eventNumber <= 6 ? 1 : 0 }} />
			<EventImage src={ASM2020} style={{ opacity: eventNumber <= 5 ? 1 : 0 }} />
			<EventImage src={ASM2019} style={{ opacity: eventNumber <= 4 ? 1 : 0 }} />
			<EventImage src={ASM2018} style={{ opacity: eventNumber <= 3 ? 1 : 0 }} />
			<EventImage src={ASM2017} style={{ opacity: eventNumber <= 2 ? 1 : 0 }} />
			<EventImage src={ASM2016} style={{ opacity: eventNumber <= 1 ? 1 : 0 }} />
			<EventImage src={ASM2015} style={{ opacity: eventNumber <= 0 ? 1 : 0 }} />

			<Timer timer={timerData} fontSize={250} style={{ zIndex: 100 }} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Countdown />);
