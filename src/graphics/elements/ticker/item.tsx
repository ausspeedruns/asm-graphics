import React from 'react';
import styled from 'styled-components';

const TickerItemContainer = styled.div`
	height: 64px;
	width: fit-content;
	font-family: Noto Sans;
	color: var(--text-light);
	display: flex;
	align-items: center;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	margin: 0 12px;
	height: 100%;
`;

const Title = styled.span`
	font-size: 28px;
	white-space: nowrap;
	margin-top: 2px;
`;

const Subtitle = styled.span`
	font-size: 17px;
	white-space: nowrap;
	margin-top: -8px;
`;

const BorderItem = styled.div`
	height: 55px;
	width: 2px;
	background: var(--accent);
`;

interface Props {
	title: string;
	sub: string;
}

export const TickerItem: React.FC<Props> = (props: Props) => {
	return (
		<TickerItemContainer>
			<VerticalStack>
				<Title>{props.title}</Title>
				<Subtitle>{props.sub}</Subtitle>
			</VerticalStack>
			<BorderItem />
		</TickerItemContainer>
	);
};
