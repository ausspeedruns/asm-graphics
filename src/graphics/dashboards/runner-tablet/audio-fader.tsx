import { Button, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import type { Headset } from "../../../extensions/audio-data";
import { Add, Remove } from "@mui/icons-material";

const AudioFaderContainer = styled.div`
	width: 94%;
	/* width: 140px; */
	height: 100px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 64px;
`;

const SliderContainer = styled.div`
	display: flex;
	align-items: center;
`;

const DBValue = styled.p`
	text-align: center;
	font-size: 30px;
	margin: 0;
	min-width: 100px;
`;

const FaderLabel = styled.div`
	min-height: 2rem;
	max-height: 2rem;
	font-size: 30px;
	margin: 0;
	border-radius: 8px;
	line-height: 2rem;
	padding: 0 8px;
`;

const StyledSlider = styled(Slider)`
	width: 85% !important;

	& .MuiSlider-thumb {
		height: 35px;
		width: 20px;
		border-radius: 5px;
		background-color: #fff;
		border: 2px solid black;
	}

	& .MuiSlider-rail {
		border: 2px solid black;
		border-radius: 0;
		background: white;
		height: 10px;
		opacity: 1;
	}

	& .MuiSlider-track {
		border: 2px solid black;
		border-radius: 0;
		height: 10px;
	}
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	label?: string;
	channel: number;
	mixBus: number;
	value: number | undefined;
	onChange: (value: number) => void;
	colour?: string;
	headset?: Headset;
	fakeDisabled?: boolean;
}

export const AudioFader = (props: Props) => {
	const [faderVal, setFaderVal] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (typeof props.value !== "undefined") {
			setFaderVal(props.value);
		}
	}, [props.value]);

	return (
		<AudioFaderContainer
			className={props.className}
			style={{ opacity: props.fakeDisabled ? 0.4 : 1, ...props.style }}
		>
			{props.label && (
				<FaderLabel
					style={{
						fontStyle: props.label === "You" ? "italic" : "initial",
						fontWeight: props.label === "You" ? "bold" : "initial",
					}}
				>
					{props.label}
				</FaderLabel>
			)}
			<SliderContainer>
				<StyledSlider
					style={{ margin: "auto" }}
					value={faderVal ?? 0}
					onChange={(_, newVal) => {
						if (!Array.isArray(newVal)) {
							setFaderVal(newVal);
							props.onChange(newVal);
						}
					}}
					min={0}
					max={1}
					step={0.001}
					// marks={marks}
					sx={{
						"& .MuiSlider-track": {
							background: props.colour,
						},
					}}
				/>
				<Button
					variant="outlined"
					onClick={() => {
						const newValue = Math.min((faderVal ?? 0) - 0.05, 1);
						setFaderVal(newValue);
						props.onChange(newValue);
					}}
					style={{ marginLeft: 20 }}
				>
					<Remove />
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						const newValue = Math.min((faderVal ?? 0) + 0.05, 1);
						setFaderVal(newValue);
						props.onChange(newValue);
					}}
				>
					<Add />
				</Button>
				<DBValue>{((faderVal ?? 0) * 100).toFixed(0)}</DBValue>
			</SliderContainer>
		</AudioFaderContainer>
	);
};
