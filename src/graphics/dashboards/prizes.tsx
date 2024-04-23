import React from "react";
import styled from "styled-components";

import { Box } from "@mui/material";

import { PRIZES } from "../prizes";

const UpcomingContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8px;
	padding-right: 24px;
`;

interface Props {
	style?: React.CSSProperties;
}

export const Prizes: React.FC<Props> = (props: Props) => {
	return (
		<UpcomingContainer style={props.style}>
			{PRIZES.map((prize) => (
				<Prize prize={prize} />
			))}
		</UpcomingContainer>
	);
};

const SingleRunContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	font-size: 13px;
	padding: 8px;
	border-radius: 7px;
	width: 100%;
	background: #eee;
`;

const PrizeContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	font-size: 1.1rem;
`;

const Item = styled.span`
	font-size: 1.2rem;
	font-weight: bold;
`;

const Requirements = styled.span``;

interface PrizeProps {
	prize: (typeof PRIZES)[number];
}

const Prize: React.FC<PrizeProps> = (props: PrizeProps) => {
	return (
		<SingleRunContainer boxShadow={2}>
			<PrizeContainer>
				<Item>
					{props.prize.quantity && `${props.prize.quantity}x - `} {props.prize.item} {props.prize.subItem}
				</Item>
			</PrizeContainer>
			<PrizeContainer>
				<Requirements>
					{props.prize.requirement}{props.prize.requirementSubheading && ` - ${props.prize.requirementSubheading}`}
				</Requirements>
			</PrizeContainer>
		</SingleRunContainer>
	);
};
