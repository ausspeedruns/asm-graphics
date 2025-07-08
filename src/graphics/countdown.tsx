import { useListenFor } from "@nodecg/react-hooks";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { Timer } from "./elements/timer";
import type { Timer as TimerType } from "@asm-graphics/types/Timer";
import { start } from "repl";

const TimeText = styled.div`
	font-size: 100px;
	font-family: Seamless;
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

export function Countdown() {
	const [endTime, setEndTime] = useState<number | null>(null);
	const [timerData, setTimerData] = useState(baseTimer);

	useEffect(() => {
		if (endTime === null) {
			return;
		}

		const interval = setInterval(() => {
			if (endTime) {
				setTimerData(createTimerData(endTime));
			}
		}, 100);

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
		<div style={{ height: 1080, width: 1920, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "black" }}>
			<img style={{position: "absolute", height: 1080, width: 1920}} />
			<Timer timer={timerData} fontSize={250} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Countdown />);
