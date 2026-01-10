import type { CSSProperties } from "react";
import styled from "styled-components";

import { FitText, FitTextElements } from "./fit-text";

interface FontProps {
	fontSize: number;
}

/*			CATEGORY			*/
const CategoryContainer = styled(FitText)`
	font-weight: bold;
	text-transform: uppercase;
`;

interface CategoryProps {
	category: string;
	style?: CSSProperties;
}

export function Category(props: CategoryProps) {
	return <CategoryContainer allowNewlines style={props.style} id="category" text={props.category} />;
}

/*			ESTIMATE			*/
const EstimateContainer = styled.div``;

const EstText = styled.span`
	font-size: 50%;
`;

const EstTime = styled.span``;

interface EstimateProps {
	estimate: string;
	style?: CSSProperties;
}

export function Estimate(props: EstimateProps) {
	let formattedEstimate = props.estimate;

	if (formattedEstimate[0] === "0" && formattedEstimate[1] !== ":") {
		formattedEstimate = formattedEstimate.substring(1);
	}

	return (
		<EstimateContainer style={props.style} id="estimate">
			<EstText>{formattedEstimate && "EST "}</EstText>
			<EstTime>{formattedEstimate}</EstTime>
		</EstimateContainer>
	);
}

/*			GAME TITLE			*/
const GameContainer = styled(FitText)`
	font-family: var(--game-font);
	line-height: 1; // Changes based on font, keep tight
`;

interface GameProps {
	game: string;
	style?: CSSProperties;
}

export function GameTitle(props: GameProps) {
	return <GameContainer allowNewlines style={props.style} id="gameTitle" text={props.game} />;
}

/*			SYSTEM			*/
const SystemContainer = styled(FitText)`
	max-width: 90%;
`;

interface SystemProps {
	system: string;
	style?: CSSProperties;
}

export function System(props: SystemProps) {
	return <SystemContainer style={props.style} text={props.system} id="system" />;
}

/*			YEAR			*/
const YearContainer = styled.div``;

interface YearProps {
	year: string;
	style?: CSSProperties;
}

export function Year(props: YearProps) {
	return (
		<YearContainer style={props.style} id="year">
			{props.year ? props.year : "????"}
		</YearContainer>
	);
}
