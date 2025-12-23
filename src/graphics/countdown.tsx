import { useListenFor } from "@nodecg/react-hooks";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
// import styled from "styled-components";
import { Timer } from "./elements/timer";
import type { Timer as TimerType } from "../types/Timer";

// import { dayTimeColours } from "./elements/useTimeColour";

// const EventImage = styled.img`
// 	position: absolute;
// 	height: 1080px;
// 	width: 1920px;

// 	transition: opacity 5s ease-in-out;
// `;

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

export function Countdown() {
	const [endTime, setEndTime] = useState<number | null>(null);
	const [timerData, setTimerData] = useState(baseTimer);

	useEffect(() => {
		if (endTime === null) {
			return;
		}

		const interval = setInterval(() => {
			if (endTime) {
				const timerData = createTimerData(endTime);
				setTimerData(timerData);
			}
		}, 50);

		return () => clearInterval(interval);
	}, [endTime]);

	useListenFor("countdown:start", (time) => {
		const [hours, minutes, seconds] = time.split(":").map(Number);

		if (hours === undefined || minutes === undefined || seconds === undefined) {
			console.error("Invalid time format received for countdown:start:", time);
			return;
		}
		
		const parsedTimer = Date.now() + (hours * 3600 + minutes * 60 + seconds) * 1000;
		setEndTime(parsedTimer);
	});

	useListenFor("countdown:stop", () => {
		setEndTime(null);
	});

	return (
		<div
			style={{
				height: 1080,
				width: 1920,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div style={{ width: 1920, height: 1080, position: "absolute" }}></div>

			<Timer timer={timerData} fontSize={250} style={{ zIndex: 100 }} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Countdown />);
