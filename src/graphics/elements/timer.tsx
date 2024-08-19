import React from "react";
import styled from "styled-components";

import { Timer as TimerType } from "@asm-graphics/types/Timer";

const TimerContainer = styled.div<FontProps>`
	display: flex;
	align-items: flex-end;
	font-family: Seamless;
	font-size: ${(props) => props.fontSize}px;
	color: var(--text-light);
	text-align: center;
	letter-spacing: 2px;
	justify-content: center;
`;

const MilliText = styled.span<FontProps>`
	font-size: ${(props) => props.fontSize / 2}px;
	letter-spacing: -1px;
	margin-left: -3px;
`;

interface FontProps {
	fontSize: number;
}

interface Props {
	timer?: TimerType;
	fontSize?: number;
	style?: React.CSSProperties;
}

const DEFAULT_FONT_SIZE = 80;

export const Timer: React.FC<Props> = (props: Props) => {
	let millis = 0;
	if (props.timer) {
		millis = Math.floor((props.timer?.milliseconds % 1000) / 100);
	}

	// A run over 10 hours though possible is unlikely for now
	let compressedTime = props?.timer?.time || "00:00:00";
	if ((props?.timer?.milliseconds || 0) < 3600000) {
		// Remove hours while under 1 hour
		compressedTime = compressedTime?.substring(3);
	} else if ((props?.timer?.milliseconds || 0) < 36000000) {
		// Remove 10's hours while under 10 hours, this would be interesting if it ever got here tho, some Final Fanstasy shit
		compressedTime = compressedTime?.substring(1);
	}

	return (
		<TimerContainer fontSize={props.fontSize ?? DEFAULT_FONT_SIZE} style={props.style}>
			<span>{compressedTime}</span>
			<MilliText fontSize={props.fontSize ?? DEFAULT_FONT_SIZE}>.{millis}</MilliText>
		</TimerContainer>
	);
};
