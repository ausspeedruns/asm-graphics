import React from 'react';
import styled from 'styled-components';

import { Timer as TimerType } from '../../types/Timer';

const TimerContainer = styled.div`
	font-family: DS-Digital;
	font-size: ${(props: FontProps) => props.fontSize}px;
	color: #ffffff;
	text-align: center;
	font-weight: bold;
`;

const MilliText = styled.span`
	font-size: ${(props: FontProps) => props.fontSize / 2}px;
	letter-spacing: -1px;
	margin-left: -3px;
`;

interface FontProps {
	fontSize: number;
}

interface Props {
	timer: TimerType | undefined;
	fontSize?: number;
	style?: React.CSSProperties;
}

export const Timer: React.FC<Props> = (props: Props) => {
	let millis = 0;
	if (props.timer) {
		millis = Math.floor((props.timer?.milliseconds % 1000) / 100);
	}

	// A run over 10 hours though possible is unlikely for now
	let compressedTime = props?.timer?.time || '00:00:00';
	if ((props?.timer?.milliseconds || 0) < 3600000) {
		// Remove hours while under 1 hour
		compressedTime = compressedTime?.substring(3);
	} else if ((props?.timer?.milliseconds || 0) < 36000000) {
		// Remove 10's hours while under 10 hours, this would be interesting if it ever got here tho, some Final Fanstasy shit
		compressedTime = compressedTime?.substring(1);
	}

	return (
		<TimerContainer fontSize={props.fontSize || 120} style={props.style}>
			{compressedTime}
			<MilliText fontSize={props.fontSize || 120}>.{millis}</MilliText>
		</TimerContainer>
	);
};
