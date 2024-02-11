import { ThemeProvider, Slider, Input } from "@mui/material";
import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "use-nodecg";
import { darkTheme } from "./theme";

const MicAudioContainer = styled.div`
	padding: 0 8px;
`;

const SliderContainer = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr;
	gap: 16px;
	margin-bottom: 48px;
`;

const marks = [
	{
		value: 1,
		label: "+10",
	},
	{
		value: 0.876,
		label: "5",
	},
	{
		value: 0.75,
		label: "0",
	},
	{
		value: 0.626,
		label: "-5",
	},
	{
		value: 0.5,
		label: "-10",
	},
	{
		value: 0.374,
		label: "-20",
	},
	{
		value: 0.253,
		label: "-30",
	},
	{
		value: 0.13,
		label: "-50",
	},
	{
		value: 0,
		label: "-∞",
	},
];

function floatToDB(f: number): number {
	if (f >= 0.5) {
		return f * 40 - 30; // max dB value: +10.
	} else if (f >= 0.25) {
		return f * 80 - 50;
	} else if (f >= 0.0625) {
		return f * 160 - 70;
	} else if (f >= 0.0) {
		return f * 480 - 90; // min dB value: -90 or -oo
	} else {
		return Number.NEGATIVE_INFINITY;
	}
}

// function dBToFloat(db: number) {
// 	if (db < -90) {
// 		return 0;
// 	} else if (db < -60) {
// 		return (db + 90) / 480
// 	} else if (db < -30) {
// 		return (db + 70) / 160
// 	} else if (db < -10) {
// 		return (db + 50) / 80
// 	} else if (db <= 10) {
// 		return (db + 30) / 40
// 	} else {
// 		return 1;
// 	}
// }

function isNumeric(str: string) {
	if (typeof str != "string") return false; // we only process strings!
	return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export const DashboardMicAudio: React.FC = () => {
	const [audioGateRep, setAudioGateRep] = useReplicant<number>("x32:audio-gate", -5);
	const [hostLevelRep, setHostLevelRep] = useReplicant<number>("x32:host-level", 0.75);

	return (
		<ThemeProvider theme={darkTheme}>
			<MicAudioContainer>
				<p>Microphone Indicator Activation dB</p>
				<SliderContainer>
					<Slider
						style={{ margin: "auto" }}
						size="small"
						value={audioGateRep ?? 0}
						onChange={(_, newVal) => {
							if (!Array.isArray(newVal)) {
								setAudioGateRep(newVal);
							}
						}}
						min={0}
						max={1}
						step={0.001}
						marks={marks}
						scale={floatToDB}
						valueLabelDisplay="auto"
						valueLabelFormat={(value) => `${value.toFixed(0)} dB`}
					/>
					<Input
						value={floatToDB(audioGateRep).toFixed(1)}
						size="small"
						onChange={(e) => {
							if (isNumeric(e.target.value)) {
								setAudioGateRep(parseFloat(e.target.value));
							}
						}}
						inputProps={{
							step: 1,
							min: -90,
							max: 10,
							type: "number",
						}}
					/>
				</SliderContainer>
				<p>Host Unmute Audio Level</p>
				<SliderContainer>
					<Slider
						style={{ margin: "auto" }}
						size="small"
						value={hostLevelRep ?? 0}
						onChange={(_, newVal) => {
							if (!Array.isArray(newVal)) {
								setHostLevelRep(newVal);
							}
						}}
						min={0}
						max={1}
						step={0.001}
						marks={marks}
						scale={floatToDB}
						valueLabelDisplay="auto"
						valueLabelFormat={(value) => `${value.toFixed(0)} dB`}
					/>
					<Input
						value={floatToDB(hostLevelRep).toFixed(1)}
						size="small"
						onChange={(e) => {
							if (isNumeric(e.target.value)) {
								setHostLevelRep(parseFloat(e.target.value));
							}
						}}
						inputProps={{
							step: 1,
							min: -90,
							max: 10,
							type: "number",
						}}
					/>
				</SliderContainer>
			</MicAudioContainer>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<DashboardMicAudio />);
