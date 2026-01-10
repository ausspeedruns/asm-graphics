import { Slider, Input } from "@mui/material";
import styled from "styled-components";
import NumberField from "./number-field";

const SliderContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	flex: 1;
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

function dbToFloat(dB: number): number {
	if (dB >= -10) {
		return (dB + 30) / 40;
	} else if (dB >= -30) {
		return (dB + 50) / 80;
	} else if (dB >= -60) {
		return (dB + 70) / 160;
	} else if (dB >= -90) {
		return (dB + 90) / 480;
	} else {
		return 0;
	}
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
			<NumberField
				size="small"
				value={floatToDB(props.value)}
				format={{ maximumFractionDigits: 1 }}
				onValueChange={(newValue) => {
					if (newValue !== null) {
						props.onChange(dbToFloat(newValue));
					}
				}}
				min={-90}
				max={10}
				sx={{ width: "110px" }}
			/>
		</SliderContainer>
	);
}
