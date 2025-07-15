import type { CSSProperties } from "react";
import styled from "styled-components";

import { FitText, FitTextElements } from "./fit-text";

interface FontProps {
	fontSize: number;
}

const BaseStyle = styled.div`
	font-family: var(--main-font);
	color: var(--text-light);
`;

/*			CATEGORY			*/
const CategoryContainer = styled(BaseStyle)`
	font-weight: bold;
	font-size: 42px;
	text-transform: uppercase;
	// -webkit-text-stroke: 1px var(--main);
`;

interface CategoryProps {
	category: string;
	maxWidth: number;
	style?: CSSProperties;
	fontSize?: number;
}

export function Category(props: CategoryProps) {
	return (
		<CategoryContainer style={props.style}>
			<FitText
				allowNewlines
				style={{ maxWidth: props.maxWidth, lineHeight: "37px", fontSize: props.fontSize }}
				text={props.category}
			/>
		</CategoryContainer>
	);
};

/*			ESTIMATE			*/
const EstimateContainer = styled(BaseStyle)``;

const EstText = styled.span<FontProps>`
	font-size: ${({ fontSize }) => fontSize * 0.6}px;
`;

const EstTime = styled.span``;

interface EstimateProps {
	estimate: string;
	fontSize?: number;
	style?: CSSProperties;
}

export function Estimate(props: EstimateProps) {
	let formattedEstimate = props.estimate;

	if (formattedEstimate[0] === "0" && formattedEstimate[1] !== ":") {
		formattedEstimate = formattedEstimate.substring(1);
	}

	return (
		<EstimateContainer style={props.style}>
			<EstText fontSize={props.fontSize ?? 34}>{formattedEstimate && "EST "}</EstText>
			<EstTime style={{ fontSize: props.fontSize ?? 34 }}>{formattedEstimate}</EstTime>
		</EstimateContainer>
	);
}

/*			GAME TITLE			*/
const GameContainer = styled(BaseStyle)`
	font-family: var(--secondary-font);
	font-size: 50px;
	font-weight: 1000;
	// -webkit-text-stroke: 2px var(--main);
`;

interface GameProps {
	game: string;
	maxWidth: number;
	style?: CSSProperties;
}

export function GameTitle(props: GameProps) {
	return (
		<GameContainer style={props.style}>
			<FitText allowNewlines style={{ maxWidth: props.maxWidth }} text={props.game} />
		</GameContainer>
	);
}

/*			SYSTEM			*/
const SystemContainer = styled(FitTextElements)`
	font-size: 35px;
	font-family: var(--main-font);
	color: var(--text-light);
	max-width: 75%;
`;

interface SystemProps {
	system: string;
	style?: CSSProperties;
}

export function System(props: SystemProps) {
	return <SystemContainer style={props.style} text={props.system} />;
}

/*			YEAR			*/
const YearContainer = styled(BaseStyle)`
	font-size: 34px;
`;

interface YearProps {
	year: string;
	style?: CSSProperties;
}

export function Year(props: YearProps) {
	if (!props.year) {
		return <></>;
	}

	return <YearContainer style={props.style}>{props.year}</YearContainer>;
}
