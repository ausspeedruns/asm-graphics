import React from 'react';
import styled from 'styled-components';

import { FitText } from './fit-text';

interface FontProps {
	fontSize: number;
}

/*			CATEGORY			*/
const CategoryContainer = styled.div`
	font-family: National Park;
	font-weight: bold;
	font-size: 42px;
	color: var(--text-col);
	text-transform: uppercase;
`;

interface CategoryProps {
	category: string;
	maxWidth: number;
	style?: React.CSSProperties;
}

export const Category: React.FC<CategoryProps> = (props: CategoryProps) => {
	return (
		<CategoryContainer style={props.style}>
			<FitText style={{ maxWidth: props.maxWidth }} text={props.category} />
		</CategoryContainer>
	);
};

/*			ESTIMATE			*/
const EstimateContainer = styled.div`
	font-family: National Park;
	color: var(--text-col);
`;

const EstText = styled.span`
	font-size: ${(props: FontProps) => props.fontSize * 0.6}px;
`;

const EstTime = styled.span`
	font-size: ${(props: FontProps) => props.fontSize}px;
`;

interface EstimateProps {
	estimate: string;
	fontSize?: number;
	style?: React.CSSProperties;
}

export const Estimate: React.FC<EstimateProps> = (props: EstimateProps) => {
	let formattedEstimate = props.estimate;
	if (formattedEstimate[0] === '0') {
		formattedEstimate = formattedEstimate.substring(1);
	}

	return (
		<EstimateContainer style={props.style}>
			<EstText fontSize={props.fontSize || 46}>EST </EstText>
			<EstTime fontSize={props.fontSize || 46}>{formattedEstimate}</EstTime>
		</EstimateContainer>
	);
};

/*			GAME TITLE			*/
const GameContainer = styled.div`
	font-family: kulturista-web, sans-serif;
	font-weight: 700;
	font-size: 50px;
	color: var(--text-col);
`;

interface GameProps {
	game: string;
	maxWidth: number;
	style?: React.CSSProperties;
}

export const GameTitle: React.FC<GameProps> = (props: GameProps) => {
	return (
		<GameContainer style={props.style}>
			<FitText style={{ maxWidth: props.maxWidth }} text={props.game} />
		</GameContainer>
	);
};

/*			SYSTEM			*/
const SystemContainer = styled.div`
	font-family: National Park;
	font-size: 35px;
	color: var(--text-col);
`;

interface SystemProps {
	system: string;
	style?: React.CSSProperties;
}

export const System: React.FC<SystemProps> = (props: SystemProps) => {
	return <SystemContainer style={props.style}>{props.system}</SystemContainer>;
};

/*			YEAR			*/
const YearContainer = styled.div`
	font-family: National Park;
	font-size: 35px;
	color: var(--text-col);
`;

interface YearProps {
	year: string;
	style?: React.CSSProperties;
}

export const Year: React.FC<YearProps> = (props: YearProps) => {
	return <YearContainer style={props.style}>{props.year}</YearContainer>;
};
