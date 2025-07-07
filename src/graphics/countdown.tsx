import { useListenFor } from "@nodecg/react-hooks";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

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

export function Countdown() {
	const [time, setTime] = useState(0);
	const [doCountdown, setDoCountdown] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (doCountdown) {
			interval = setInterval(() => {
				setTime((prevTime) => {
					if (prevTime <= 0) {
						clearInterval(interval);
						setDoCountdown(false);
						return 0;
					}
					return prevTime - 1;
				});
			}, 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, [doCountdown]);

	useListenFor("countdown:start", (newTime: string) => {
		const parts = newTime.split(":").map(Number);
		setTime(parts[0] * 3600 + parts[1] * 60 + parts[2]);
		setDoCountdown(true);
	});

	useListenFor("countdown:stop", () => {
		setDoCountdown(false);
	});

	return (
		<div>
			<TimeText>{formatTime(time)}</TimeText>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Countdown />);
