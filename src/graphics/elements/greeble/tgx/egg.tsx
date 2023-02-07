import React from 'react';
import styled from 'styled-components';

const EggContainer = styled.svg``;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	colour: 'Red' | 'Yellow' | 'Blue' | 'Green';
}

function colourToHex(colour: Props['colour']) {
	switch (colour) {
		case 'Red':
			return '#F80023';
		case 'Yellow':
			return '#FFC300';
		case 'Blue':
			return '#007EFF';
		case 'Green':
			return '#00C091';
	}
}

// Look at the little fella
export const Egg: React.FC<Props> = (props: Props) => {
	return (
		<EggContainer
			width="254"
			height="283"
			viewBox="0 0 254 283"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={props.className}
			style={props.style}>
			<path
				d="M253.826 160.485C253.826 105.768 211.66 0.544312 127.326 0.544312C42.9931 0.544312 0.826416 105.768 0.826416 160.485C0.826416 244.664 80.9431 282.544 127.326 282.544C173.71 282.544 253.826 244.664 253.826 160.485Z"
				fill={colourToHex(props.colour)}
			/>
		</EggContainer>
	);
};
