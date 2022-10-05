import React from 'react';
import styled, { keyframes } from 'styled-components';

const RotationAnimation = keyframes`
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
`;

const PaxCirclesContainer = styled.div``;

const PaxCirclesIMG = styled.img`
	transform-origin: center;
	animation: ${RotationAnimation} 180s linear 0s infinite;
	width: 100%;
	height: 100%;
	mix-blend-mode: screen;
`;

import PAXCircles from '../media/PAXCircles.svg';

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const PaxCircles: React.FC<Props> = (props: Props) => {
	return (
		<PaxCirclesContainer className={props.className} style={props.style}>
			<PaxCirclesIMG src={PAXCircles} />
		</PaxCirclesContainer>
	);
};
