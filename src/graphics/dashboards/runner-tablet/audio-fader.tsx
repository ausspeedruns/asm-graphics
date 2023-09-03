import { Slider } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FitText } from "../../elements/fit-text";

const AudioFaderContainer = styled.div`
	height: 100%;
	width: 5rem;
	min-width: 5rem;
	max-width: 5rem;
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
`;

const DBValue = styled.p`
	text-align: center;
	font-size: 1.2rem;
	margin: 0;
	margin-bottom: 1rem;
`;

const FaderLabel = styled(FitText)`
	text-align: center;
	min-height: 2rem;
	max-height: 2rem;
	font-size: 1.2rem;
	margin: 0;
	display: flex;
	justify-content: center;
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

const StyledSlider = styled(Slider)`
	width: 5px !important;

	& .MuiSlider-thumb {
		height: 35px;
		width: 20px;
		border-radius: 5px;
		background-color: #000;
	}

	& .MuiSlider-rail {
		border: 2px solid black;
		background: white;
	}

	& .MuiSlider-track {
		border: 0;
	}
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	label: string;
	channel: number;
	mixBus: number;
	value: number | undefined;
	onChange: (value: number) => void;
	colour?: string;
}

export const AudioFader = (props: Props) => {
	const [faderVal, setFaderVal] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (typeof props.value !== "undefined") {
			setFaderVal(props.value);
		}
	}, [props.value]);

	const dbVal = floatToDB(faderVal ?? NaN);

	return (
		<AudioFaderContainer className={props.className} style={props.style}>
			<FaderLabel
				style={{
					fontStyle: props.label === "You" ? "italic" : "initial",
					fontWeight: props.label === "MASTER" ? "bold" : "normal",
				}}
				text={props.label}
			/>
			<DBValue>
				{dbVal > 0 && "+"}
				{dbVal === Number.NEGATIVE_INFINITY ? "-∞" : dbVal.toFixed(1)}
				{/* <br/>
				{faderVal} */}
			</DBValue>
			<StyledSlider
				style={{ margin: "auto" }}
				size="medium"
				orientation="vertical"
				// value={props.value}
				value={faderVal ?? 0}
				onChange={(_, newVal) => {
					// if (!Array.isArray(newVal)) updateFader(newVal);
					if (!Array.isArray(newVal)) {
						setFaderVal(newVal);
						props.onChange(newVal);
					}
				}}
				min={0}
				max={1}
				step={0.001}
				marks={marks}
				sx={{
					"& .MuiSlider-track": {
						background: `linear-gradient(0deg, ${props.colour}, black)`,
					},
				}}
			/>
		</AudioFaderContainer>
	);
};

function floatToDB(f: number) {
	if (f >= 0.5) {
		return f * 40 - 30; // max dB value: +10.
	} else if (f >= 0.25) {
		return f * 80 - 50;
	} else if (f >= 0.0625) {
		return f * 160 - 70;
	} else if (f >= 0.0) {
		// return f * 480 - 90; // min dB value: -90 or -oo
		return Number.NEGATIVE_INFINITY;
	} else {
		return Number.NEGATIVE_INFINITY;
	}
}
