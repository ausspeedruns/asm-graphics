import { Slider } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';

const AudioFaderContainer = styled.div`
	height: 100%;
	width: 4rem;
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
`;

const DBValue = styled.p`
	text-align: center;
`;

const FaderLabel = styled.p`
	text-align: center;
	min-height: 2rem;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	label: string;
	channel: number;
	mixBus: number;
}

export const AudioFader = (props: Props) => {
	const [faderVal, setFaderVal] = useState(0.75);

	function updateFader(value: number) {
		setFaderVal(value);

		nodecg.sendMessage('x32:setFader', {float: value, channel: props.channel, mixBus: props.mixBus});
	}

	const dbVal = floatToDB(faderVal);

	return (
		<AudioFaderContainer className={props.className} style={props.style}>
			<DBValue>
				{dbVal > 0 && "+"}{dbVal.toFixed(1)}
			</DBValue>
			<Slider
				style={{margin: 'auto'}}
				size="medium"
				orientation="vertical"
				value={faderVal}
				onChange={(_, newVal) => {
					if (!Array.isArray(newVal)) updateFader(newVal);
				}}
				min={0}
				max={1}
				step={0.01}
			/>
			<FaderLabel>
				{props.label}
			</FaderLabel>
		</AudioFaderContainer>
	);
};

function floatToDB(f: number): number {
	if (f >= 0.5) {
		return f * 40 - 30 // max dB value: +10.
	} else if (f >= 0.25) {
		return f * 80 - 50
	} else if (f >= 0.0625) {
		return f * 160 - 70
	} else if (f >= 0.0) {
		return f * 480 - 90 // min dB value: -90 or -oo
	} else {
		return Number.NEGATIVE_INFINITY
	}
}
