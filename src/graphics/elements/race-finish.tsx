import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

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
	font-family: Noto Sans;
`;

const Position = styled.div`
	font-weight: bold;
	height: 35px;
	width: 35px;
	text-align: center;
	line-height: 35px;
	background-color: rgba(0, 0, 0, 0.22);
`;

const FinalTime = styled.div``;

interface RaceFinishProps {
	time: string | undefined;
	place: number;
	style?: React.CSSProperties;
	className?: string;
}

export const RaceFinish: React.FC<RaceFinishProps> = (props: RaceFinishProps) => {
	const animRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		if (props.time === '') {
			gsap.to(animRef.current, { y: 35 });
			return;
		}
		gsap.to(animRef.current, { y: 0, duration: 1 });
	}, [props.time]);

	// let finalPlace = 4;
	// if (props.time.teamFinishTimes[props.teamID]) {
	// 	// Forfeit dont get a place (sorry runner)
	// 	if (props.time.teamFinishTimes[props.teamID].state === 'forfeit') {
	// 		finalPlace = -1;
	// 	} else {
	// 		// On a scale of 1 to fucked this is probably just a weird look
	// 		// Get place
	// 		const allFinishTimes = [];
	// 		for (const teamID in props.time.teamFinishTimes) {
	// 			allFinishTimes.push([teamID, props.time.teamFinishTimes[teamID].milliseconds]);
	// 		}

	// 		allFinishTimes.sort((a, b) => {
	// 			// Just to satisfy TS
	// 			if (typeof a[1] === 'number' && typeof b[1] === 'number') {
	// 				return a[1] - b[1];
	// 			}

	// 			return 0;
	// 		});

	// 		finalPlace = allFinishTimes.findIndex((element) => element[0] === props.teamID) + 1;
	// 	}
	// }

	let bgColour = '#fff';
	switch (props.place) {
		case 1:
			bgColour = '#dab509';
			break;

		case 2:
			bgColour = '#a1a1a1';
			break;

		case 3:
			bgColour = '#ae7058';
			break;
	}

	return (
		<RaceFinishContainer className={props.className} style={props.style}>
			<AnimatedContainer ref={animRef} style={{ backgroundColor: bgColour }}>
				<Position>{props.place === -1 ? 'X' : props.place}</Position>
				<FinalTime>
					{props.time}
				</FinalTime>
			</AnimatedContainer>
		</RaceFinishContainer>
	);
};
