import type { CSSProperties } from "react";
import styled from "styled-components";

import { FitText, FitTextElements } from "./fit-text";

interface FontProps {
	fontSize: number;
}

const BaseStyle = styled.div`
	font-family: var(--main-font);
	color: var(--text-light);

	// ASAP2025
	font-family: Reenie Beanie;
`;

/*			CATEGORY			*/
const CategoryContainer = styled(BaseStyle)`
	font-weight: bold;
	font-size: 42px;
	text-transform: uppercase;

	// ASAP2025
	color: #E97100;
	font-family: Permanent Marker;
	font-weight: normal;
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
}

/*			ESTIMATE			*/
const EstimateContainer = styled(BaseStyle)`
	// ASAP2025
	color: #E97100;
	-webkit-text-stroke: 2px #E97100;

`;

const EstText = styled.span<FontProps>`
	font-size: ${({ fontSize }) => fontSize * 0.5}px;
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
	
	// ASAP2025
	background: #000000;
	padding: 10px 20px;
	border-radius: 11px;
	color: #FFC94B;
	font-family: Digital Numbers;
	font-size: 20px;
	font-weight: normal;
	display: flex;
	justify-content: center;
	align-items: center;
	
	& > div {
		filter: drop-shadow(0px 0px 15.7px #FF4F23);
	}
`;

interface GameProps {
	game: string;
	maxWidth: number;
	style?: CSSProperties;
}

export function GameTitle(props: GameProps) {
	return (
		<GameContainer style={props.style}>
			<FitText allowNewlines style={{ maxWidth: props.maxWidth, lineHeight: 1.2 }} text={props.game} />
		</GameContainer>
	);
}

/*			SYSTEM			*/
const SystemContainer = styled(FitTextElements)`
	font-size: 35px;
	font-family: var(--main-font);
	color: var(--text-light);
	max-width: 75%;

	// ASAP2025
	font-family: Reenie Beanie;
	color: #009AA2;
	-webkit-text-stroke: 3px #009AA2;
	max-width: 100%;
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

	// ASAP2025
	color: #009AA2;
	-webkit-text-stroke: 3px #009AA2;
`;

interface YearProps {
	year: string;
	style?: CSSProperties;
}

export function Year(props: YearProps) {
	// if (!props.year) {
	// 	return <></>;
	// }

	return <YearContainer style={props.style}>{props.year ? props.year : 9999}</YearContainer>;
}
