import { Slider } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FitText } from '../../elements/fit-text';

const AudioFaderContainer = styled.div`
	height: 100%;
	width: 7rem;
	min-width: 7rem;
	max-width: 7rem;
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
`;

const DBValue = styled.p`
	text-align: center;
	font-size: 1.5rem;
	margin: 0;
	margin-bottom: 1rem;
`;

const FaderLabel = styled(FitText)`
	text-align: center;
	min-height: 2rem;
	max-height: 2rem;
	font-size: 1.5rem;
	margin: 0;
	display: flex;
	justify-content: center;
`;

const marks = [
	{
		value: 1,
		label: '+10',
	},
	{
		value: 0.876,
		label: '5',
	},
	{
		value: 0.75,
		label: '0',
	},
	{
		value: 0.626,
		label: '-5',
	},
	{
		value: 0.5,
		label: '-10',
	},
	{
		value: 0.374,
		label: '-20',
	},
	{
		value: 0.253,
		label: '-30',
	},
	{
		value: 0.13,
		label: '-50',
	},
	{
		value: 0,
		label: '-∞',
	},
];

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

		nodecg.sendMessage('x32:setFader', { float: value, channel: props.channel, mixBus: props.mixBus });
	}

	const dbVal = floatToDB(faderVal);

	return (
		<AudioFaderContainer className={props.className} style={props.style}>
			<FaderLabel
				style={{
					fontStyle: props.label === 'You' ? 'italic' : 'initial',
					fontWeight: props.label === 'MASTER' ? 'bold' : 'normal',
				}}
				text={props.label}
			/>
			<DBValue>
				{dbVal > 0 && '+'}
				{dbVal === Number.NEGATIVE_INFINITY ? '-∞' : dbVal.toFixed(1)}
				{/* <br/>
				{faderVal} */}
			</DBValue>
			<Slider
				style={{ margin: 'auto' }}
				size="medium"
				orientation="vertical"
				value={faderVal}
				onChange={(_, newVal) => {
					if (!Array.isArray(newVal)) updateFader(newVal);
				}}
				min={0}
				max={1}
				step={0.001}
				marks={marks}
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
