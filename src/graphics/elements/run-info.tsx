import React from 'react';
import styled from 'styled-components';

import { FitText } from './fit-text';

interface FontProps {
	fontSize: number;
}

const BaseStyle = styled.div`
	font-family: 'Noto Sans';
	color: var(--text-light);
`;

/*			CATEGORY			*/
const CategoryContainer = styled(BaseStyle)`
	font-weight: bold;
	font-size: 42px;
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
const EstimateContainer = styled(BaseStyle)``;

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
const GameContainer = styled(BaseStyle)`
	font-weight: 700;
	font-size: 50px;
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
const SystemContainer = styled(BaseStyle)`
	font-size: 35px;
`;

interface SystemProps {
	system: string;
	style?: React.CSSProperties;
}

export const System: React.FC<SystemProps> = (props: SystemProps) => {
	return <SystemContainer style={props.style}>{props.system}</SystemContainer>;
};

/*			YEAR			*/
const YearContainer = styled(BaseStyle)`
	font-size: 35px;
`;

interface YearProps {
	year: string;
	style?: React.CSSProperties;
}

export const Year: React.FC<YearProps> = (props: YearProps) => {
	return <YearContainer style={props.style}>{props.year}</YearContainer>;
};
