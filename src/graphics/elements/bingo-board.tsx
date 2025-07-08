import type { BoardCell, CellColour } from "extensions/util/bingosync";
import styled from "styled-components";

const Cell = styled.div`
	font-family: var(--main-font);
	background: #764a96;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 75%;
	padding: 0 4px;
	color: white;
	text-align: center;
	text-wrap: balance;
	position: relative;
	line-height: 1.1;
`;

function backgroundGradientGenerator(colours: CellColour[]): string {
	if (colours.length === 0 || colours[0] === "blank") {
		return "";
	}

	let currentPercentage = 0;
	const adder = 100 / colours.length;

	const allColours: string[] = [];

	colours.forEach((colour) => {
		allColours.push(`${colour} ${currentPercentage}%, ${colour} ${currentPercentage + adder}%`);
		currentPercentage += adder;
	});

	const linearGradient = `linear-gradient(90deg, ${allColours.join(", ")})`;

	return linearGradient;
}

interface BingoBoardProps {
	className?: string;
	style?: React.CSSProperties;
	board?: BoardCell[];
}

export function BingoBoard(props: BingoBoardProps) {
	const cells =
		props.board ??
		Array.from({ length: 25 }, (_, i) => ({
			slot: `slot${i}`,
			name: "",
			colors: ["blank"],
		}));

	return (
		<div
			className={props.className}
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(5, 1fr)",
				gridTemplateRows: "repeat(5, 1fr)",
				...props.style,
			}}>
			{cells.map((cell) => {
				const cellDone = cell.colors.length >= 2;
				return (
					<Cell key={cell.slot} style={{ background: backgroundGradientGenerator(cell.colors) }}>
						<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
							<ExtraBacking
								style={{
									backgroundColor: cellDone ? "rgba(105, 42, 153, 0.61)" : undefined,
									mixBlendMode: cellDone ? "multiply" : undefined,
								}}
							/>
							<PlasticElement
								style={{
									boxShadow:
										cellDone
											? "inset -3px -3px 1.5px rgba(217, 211, 224, 0.34), inset 4px 3px 1.5px rgba(68, 42, 105, 0.77)"
											: "inset 3px 3px 1.5px rgba(217, 211, 224, 0.34),	inset -4px -3px 1.5px rgba(68, 42, 105, 0.77)",
								}}
							/>
						</div>
						<span style={{ zIndex: 4, color: cellDone ? "rgba(255, 255, 255, 0.77)" : "white" }}>{cell.name}</span>
					</Cell>
				);
			})}
		</div>
	);
}

const ExtraBacking = styled.div`
	background-color: rgba(194, 156, 226, 0.14);
	mix-blend-mode: color;
	height: 100%;
	width: 100%;
	position: absolute;
	z-index: 1;
`;

const PlasticElement = styled.div`
	position: absolute;
	height: 100%;
	width: 100%;
	background: rgba(105, 42, 153, 0.09);
	z-index: 2;

	backdrop-filter: blur(2px);
	// box-shadow:
	// 	inset 3px 3px 1.5px rgba(217, 211, 224, 0.34),
	// 	inset -4px -3px 1.5px rgba(68, 42, 105, 0.77);
	box-shadow:
		inset -3px -3px 1.5px rgba(217, 211, 224, 0.34),
		inset 4px 3px 1.5px rgba(68, 42, 105, 0.77);
`;
