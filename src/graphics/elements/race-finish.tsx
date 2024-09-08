import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import gsap from "gsap";

const RaceFinishContainer = styled.div`
	overflow: hidden;
	position: absolute;
`;

const AnimatedContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 130px;
	height: 35px;
	padding-right: 4px;
	box-sizing: border-box;
	font-size: 22px;
	color: #ffffff;
	font-family: var(--main-font);
`;

const Position = styled.div`
	font-weight: bold;
	height: 35px;
	width: 35px;
	text-align: center;
	line-height: 36px;
	background-color: rgba(0, 0, 0, 0.22);
`;

const FinalTime = styled.div`
	line-height: 36px;
	width: 100%;
	text-align: center;
`;

function timeFormat(time?: string) {
	if (!time) return "";

	let formattedTime = time;
	if (formattedTime[0] === "0") {
		formattedTime = formattedTime?.substring(1);
	} else {
		return formattedTime;
	}

	if (formattedTime[0] === "0") {
		formattedTime = formattedTime?.substring(2);
	} else {
		return formattedTime;
	}

	if (formattedTime[0] === "0") {
		formattedTime = formattedTime?.substring(1);
	}

	return formattedTime;
}

interface RaceFinishProps {
	time: string | undefined;
	place: number;
	style?: React.CSSProperties;
	className?: string;
}

export const RaceFinish: React.FC<RaceFinishProps> = (props: RaceFinishProps) => {
	const animRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!props.time || props.time === "" || props.time === "undefined") {
			gsap.to(animRef.current, { y: 35 });
			return;
		}
		gsap.to(animRef.current, { y: 0, duration: 1 });
	}, [props.time]);

	let bgColour = "#e0e0e0";
	switch (props.place) {
		case 1:
			bgColour = "#dab509";
			break;
		case 2:
			bgColour = "#a1a1a1";
			break;
		case 3:
			bgColour = "#ae7058";
			break;
	}

	return (
		<RaceFinishContainer className={props.className} style={props.style}>
			<AnimatedContainer ref={animRef} style={{ backgroundColor: bgColour }}>
				<Position>{props.place === -1 ? "X" : props.place}</Position>
				<FinalTime>{timeFormat(props.time)}</FinalTime>
			</AnimatedContainer>
		</RaceFinishContainer>
	);
};
