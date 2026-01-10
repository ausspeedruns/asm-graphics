import styled from "styled-components";

import type { Timer as TimerType } from "@asm-graphics/types/Timer";

const TimerContainer = styled.div`
	display: flex;
	align-items: flex-end;
	font-family: Seamless;
	color: var(--text-light);
	text-align: center;
	letter-spacing: 2px;
	justify-content: center;
`;

const MilliText = styled.span`
	font-size: 50%;
	margin-left: -3%;
`;

interface FontProps {
	fontSize: number;
}

interface Props {
	timer?: TimerType;
	style?: React.CSSProperties;
}

export function Timer(props: Props) {
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
		<TimerContainer style={props.style} id="timer">
			<span>{compressedTime}</span>
			<MilliText>.{millis}</MilliText>
		</TimerContainer>
	);
}
