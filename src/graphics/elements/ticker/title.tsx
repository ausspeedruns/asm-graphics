import React from 'react';
import styled from 'styled-components';

const TickerTitleContainer = styled.div`
	height: 64px;
	width: fit-content;
	font-family: National Park;
	font-weight: bold;
	font-size: 20px;
	color: #F2DAB2;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #302414;
	white-space: nowrap;
	padding: 0 10px;
	text-align: center;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export const TickerTitle: React.FC<Props> = (props: React.PropsWithChildren<Props>) => {
	return (
		<TickerTitleContainer className={props.className} style={props.style}>
			{props.children}
		</TickerTitleContainer>
	);
};
