import { ThemeProvider, Slider, Input } from "@mui/material";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import { darkTheme } from "./theme";
import { RecordVoiceOver, WbIncandescent, Speaker, LiveTv, MusicNote } from "@mui/icons-material";

const Label = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

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
	const [audioGateRep, setAudioGateRep] = useReplicant<number>("x32:audio-gate");
	const [hostLevelStreamRep, setHostLevelStreamRep] = useReplicant<number>("x32:host-level-stream");
	const [hostLevelSpeakersRep, setHostLevelSpeakersRep] = useReplicant<number>("x32:host-level-speakers");
	const [obsLevelStreamRep, setObsLevelStreamRep] = useReplicant<number>("obs-level-stream");
	const [obsLevelSpeakersRep, setObsLevelSpeakersRep] = useReplicant<number>("obs-level-speakers");	


	return (
		<ThemeProvider theme={darkTheme}>
			<MicAudioContainer>
				<Label>
					<RecordVoiceOver /> <LiveTv /> Host Audio Level STREAM
				</Label>
				<SliderContainer>
					<Slider
						style={{ margin: "auto", color:"#ff5eb1"   }}
						size="small"
						value={hostLevelStreamRep ?? 0}
						onChange={(_, newVal) => {
							if (!Array.isArray(newVal)) {
								setHostLevelStreamRep(newVal);
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
						value={floatToDB(hostLevelStreamRep ?? 0).toFixed(1)}
						size="small"
						onChange={(e) => {
							if (isNumeric(e.target.value)) {
								setHostLevelStreamRep(parseFloat(e.target.value));
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
				<Label>
					<RecordVoiceOver /> <Speaker /> Host Audio Level SPEAKERS
				</Label>
				<SliderContainer>
					<Slider
						style={{ margin: "auto", color:"#ff5eb1"   }}
						size="small"
						value={hostLevelSpeakersRep ?? 0}
						onChange={(_, newVal) => {
							if (!Array.isArray(newVal)) {
								setHostLevelSpeakersRep(newVal);
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
						value={floatToDB(hostLevelSpeakersRep ?? 0).toFixed(1)}
						size="small"
						onChange={(e) => {
							if (isNumeric(e.target.value)) {
								setHostLevelSpeakersRep(parseFloat(e.target.value));
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
				<Label>
					<MusicNote /> <LiveTv /> OBS (Music) Audio Level STREAM
				</Label>
				<SliderContainer>
					<Slider
						style={{ margin: "auto", color:"#fff"  }}
						size="small"
						value={obsLevelStreamRep ?? 0}
						onChange={(_, newVal) => {
							if (!Array.isArray(newVal)) {
								setObsLevelStreamRep(newVal);
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
						value={floatToDB(obsLevelStreamRep ?? 0).toFixed(1)}
						size="small"
						onChange={(e) => {
							if (isNumeric(e.target.value)) {
								setObsLevelStreamRep(parseFloat(e.target.value));
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
				<Label>
					<MusicNote /> <Speaker /> OBS (Music) Audio Level SPEAKERS
				</Label>
				<SliderContainer>
					<Slider
						style={{ margin: "auto", color:"#fff" }}
						size="small"
						value={obsLevelSpeakersRep ?? 0}
						onChange={(_, newVal) => {
							if (!Array.isArray(newVal)) {
								setObsLevelSpeakersRep(newVal);
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
						value={floatToDB(obsLevelSpeakersRep ?? 0).toFixed(1)}
						size="small"
						onChange={(e) => {
							if (isNumeric(e.target.value)) {
								setObsLevelSpeakersRep(parseFloat(e.target.value));
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
				<Label>
					<WbIncandescent /> Microphone Indicator Activation dB
				</Label>
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
						value={floatToDB(audioGateRep ?? 0).toFixed(1)}
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
			</MicAudioContainer>
		</ThemeProvider>
	);
};

createRoot(document.getElementById("root")!).render(<DashboardMicAudio />);
