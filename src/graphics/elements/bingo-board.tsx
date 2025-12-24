import type { BoardCell, CellColour } from "@asm-graphics/shared/BingoSync.js";
import styled from "styled-components";

const Cell = styled.div`
	font-family: var(--main-font);
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
	color: white;
	background-color: #3d3d3dff;
	outline: 1px solid #ffc75b;
`;

export const cellColourMapping: Record<CellColour, string> = {
	purple: "#000000", // Not purple
	blue: "#1a85ff", // Not blue
	green: "#4a9d2a",
	red: "#9d2a2a",
	yellow: "#9d8f2a",
	orange: "#9d5f2a",
	pink: "#9d2a7f",
	brown: "#9d6f2a",
	navy: "#2a4a9d",
	teal: "#2a9d9d",
	blank: "transparent",
};

function backgroundGradientGenerator(colours: CellColour[]): string {
	if (colours.length === 0 || colours[0] === "blank") {
		return "";
	}

	let currentPercentage = 0;
	const adder = 100 / colours.length;

	const allColours: string[] = [];

	colours.forEach((colour) => {
		const hexColour = cellColourMapping[colour] ?? colour;
		allColours.push(`${hexColour} ${currentPercentage}%, ${hexColour} ${currentPercentage + adder}%`);
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
	const cells: BoardCell[] =
		!props.board || props.board.length === 0
			? Array.from({ length: 25 }, (_, i) => ({
					slot: `slot${i}`,
					name: "",
					colors: ["blank"],
				}))
			: props.board;

	return (
		<div
			className={props.className}
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(5, 1fr)",
				gridTemplateRows: "repeat(5, 1fr)",
				...props.style,
			}}
		>
			{cells.map((cell) => {
				const cellDone = cell.colors.length >= 1 && cell.colors[0] !== "blank";
				return (
					<Cell
						key={cell.slot}
						style={{
							background: backgroundGradientGenerator(cell.colors),
							boxShadow: cellDone ? "inset 0 0 15px 0 rgba(0,0,0,0.5)" : "none",
							outline: cellDone ? "1px solid #ffc85b8c" : "1px solid #ffc75b",
						}}
					>
						<span style={{ zIndex: 4, opacity: cellDone ? 0.77 : 1 }}>{cell.name}</span>
					</Cell>
				);
			})}
		</div>
	);
}
