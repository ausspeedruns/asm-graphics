import styled from "@emotion/styled";

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
	milliseconds?: number;
	style?: React.CSSProperties;
}

export function Timer(props: Props) {
	let millis = 0;
	if (props.milliseconds) {
		millis = Math.floor((props.milliseconds % 1000) / 100);
	}

	// A run over 10 hours though possible is unlikely for now
	let compressedTime = millisecondsToDisplayTime(props.milliseconds ?? 0);

	return (
		<TimerContainer style={props.style} id="timer">
			<span>{compressedTime}</span>
			<MilliText>.{millis}</MilliText>
		</TimerContainer>
	);
}

function millisecondsToDisplayTime(milliseconds: number): string {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	let result = "";

	if (hours > 0) {
		if (hours >= 10) {
			result = String(hours).padStart(2, "0") + ":";
		} else {
			result = String(hours) + ":";
		}
	}

	result += String(minutes).padStart(2, "0") + ":";
	result += String(seconds).padStart(2, "0");

	return result;
}
