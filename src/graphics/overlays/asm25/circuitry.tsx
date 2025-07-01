import styled from "styled-components";

import circuitBoardImage from "./board-158973_1920 1.png";

const PlasticElement = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(105, 42, 153, 0.36);
	z-index: 2;

	backdrop-filter: blur(2px);

	// Temp edges
	box-shadow:
		inset 6px 6px 3px rgba(217, 211, 224, 0.34),
		inset -8px -7px 3px rgba(68, 42, 105, 0.77);
`;

// const CircuitBoard = styled.img`
// 	position: absolute;
// 	object-fit: cover;
// 	height: 100%;
// 	width: 100%;
// `;

const CircuitBoard = styled.div`
	background-size: cover;
	background-position: center;
`;

interface CircuitryProps {
	style?: React.CSSProperties;
	noCircuitBoard?: boolean;
}

export function Circuitry(props: CircuitryProps) {
	return (
		<CircuitBoard
			style={{ backgroundImage: props.noCircuitBoard ? "none" : `url(${circuitBoardImage})`, ...props.style }}>
			<div
				style={{
					backgroundColor: "#C39CE2",
					mixBlendMode: "color",
					height: "100%",
					width: "100%",
					position: "absolute",
					zIndex: 1,
				}}
			/>
			<PlasticElement />
		</CircuitBoard>
	);
}
