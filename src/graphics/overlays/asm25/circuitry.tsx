import styled from "styled-components";

import circuitBoardImage from "./board-158973_1920 1.png";

const PlasticElement = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	z-index: -1;

	backdrop-filter: blur(2px);
`;

function generateBoxShadows(bigShadowAngle: number) {
	const bigAngleX = Math.cos((bigShadowAngle * Math.PI) / 180) * 150;
	const bigAngleY = Math.sin((bigShadowAngle * Math.PI) / 180) * 150;

	return `
		inset 6px 6px 3px rgba(220, 220, 220, 0.34),
		inset -8px -7px 3px rgba(0, 0, 0, 0.278),
		inset ${bigAngleX}px ${bigAngleY}px 150px rgba(17, 17, 17, 0.6)
		`;
}

const CircuitBoard = styled.div`
	background-size: cover;
	background-position: center;
`;

interface CircuitryProps {
	style?: React.CSSProperties;
	noCircuitBoard?: boolean;
	bigShadowAngle?: number;
	disableBaseColourLayer?: boolean;
}

export function Circuitry(props: CircuitryProps) {

	const test = generateBoxShadows(props.bigShadowAngle ?? 0);

	return (
		<CircuitBoard
			style={{ backgroundImage: props.noCircuitBoard ? "none" : `url(${circuitBoardImage})`, zIndex: -3, ...props.style }}>
			{!props.disableBaseColourLayer && (<div
				style={{
					backgroundColor: "var(--plastic-bottom)",
					mixBlendMode: "color",
					height: "100%",
					width: "100%",
					position: "absolute",
					zIndex: -2,
				}}
			/>)}
			<PlasticElement style={{
				boxShadow: test,
				backgroundColor: "var(--plastic-top)",
			}} />
		</CircuitBoard>
	);
}
