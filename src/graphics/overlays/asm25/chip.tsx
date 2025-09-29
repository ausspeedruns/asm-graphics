import styled from "styled-components";

const Pad = styled.div`
    width: 26px;
    height: 10px;
    background-color: #fff;
    border: 3px solid #483a72;
    z-index: 10;
`;

const PadColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    position: absolute;
`;

const ChipBody = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background-color:rgba(110, 105, 145, 0.73);
    border: 5px solid #444E6C;
`;

interface ChipProps {
	numberOfPads?: number;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	padStyle?: React.CSSProperties;
}

export function Chip(props: ChipProps) {
	const { numberOfPads = 2, style, children } = props;

	return (
		<ChipBody style={style}>
			<PadColumn style={{ left: -24 }}>
				{Array.from({ length: numberOfPads }, (_, index) => (
					<Pad key={index} style={props.padStyle} />
				))}
			</PadColumn>
			{children}
			<PadColumn style={{ right: -24 }}>
				{Array.from({ length: numberOfPads }, (_, index) => (
					<Pad key={index} style={props.padStyle} />
				))}
			</PadColumn>
		</ChipBody>
	);
}
