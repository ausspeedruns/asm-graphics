import { Slider, Input } from "@mui/material";
import styled from "styled-components";

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

function isNumeric(str: string) {
	if (typeof str != "string") return false; // We only process strings!
	return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

interface AudioSliderProps {
	value: number;
	onChange: (newValue: number) => void;
}

export function AudioSlider(props: AudioSliderProps) {
	return (
		<SliderContainer>
			<Slider
				style={{ margin: "auto" }}
				size="small"
				value={props.value}
				onChange={(_, newVal) => {
					if (!Array.isArray(newVal)) {
						props.onChange(newVal);
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
				value={floatToDB(props.value).toFixed(1)}
				size="small"
				onChange={(e) => {
					if (isNumeric(e.target.value)) {
						props.onChange(parseFloat(e.target.value));
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
	);
}
