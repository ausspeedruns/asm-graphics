import { useState } from "react";
import { createRoot } from "react-dom/client";
import TextField from "@mui/material/TextField";
import { Stack, Button, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";

type TimerFormat = `${number}:${number}:${number}`;

function formatTime(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function checkTimerFormat(value: string): value is TimerFormat {
	const regex = /^\d{2}:\d{2}:\d{2}$/;
	return regex.test(value);
}

function parseTimerFormat(value: string): number {
	if (!checkTimerFormat(value)) {
		throw new Error("Invalid timer format. Expected HH:MM:SS.");
	}

	const [hours, minutes, seconds] = value.split(":").map(Number);
	return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export function CountdownDashboard() {
	const [time, setTime] = useState<string>("00:15:00");
	const [timeSent, setTimeSent] = useState<number | null>(null);
	const [countdownActive, setCountdownActive] = useState<boolean | null>(null);

	function startCountdown() {
		if (!checkTimerFormat(time)) {
			alert("Invalid time format. Please use HH:MM:SS.");
			return;
		}

		nodecg.sendMessage("countdown:start", time);
		setTimeSent(Date.now());
		setCountdownActive(true);
	}

	function stopCountdown() {
		nodecg.sendMessage("countdown:stop");

		// Set time to the value we would be at if we had to stop
		if (timeSent === null) return;

		const stopTime = parseTimerFormat(time) - (Date.now() - timeSent);
		setTime(formatTime(stopTime));
		setCountdownActive(false);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<TextField
				fullWidth
				label="Countdown"
				value={time}
				onChange={(e) => {
					setTime(e.target.value);
				}}
				slotProps={{ htmlInput: { maxLength: 8, inputMode: "numeric", pattern: "\\d{2}:\\d{2}:\\d{2}" } }}
				helperText="Format: 00:00:00"
				disabled={Boolean(countdownActive)}
			/>

			<Stack direction="row" spacing={1}>
				<Button
					variant="contained"
					color="success"
					onClick={startCountdown}
					fullWidth
					disabled={Boolean(countdownActive)}
				>
					Start
				</Button>
				<Button
					variant={Boolean(countdownActive) ? "contained" : "outlined"}
					color="error"
					onClick={stopCountdown}
					fullWidth
					disabled={countdownActive !== null && !countdownActive}
				>
					Stop
				</Button>
			</Stack>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<CountdownDashboard />);
