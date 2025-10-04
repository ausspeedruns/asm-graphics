import styled from "styled-components";

import ASAP25TickerArrow from "../../overlays/backgrounds/ASAP25TickerArrow.svg";

const TickerTitleContainer = styled.div`
	height: 59px;
	width: fit-content;
	font-family: var(--secondary-font);
	font-size: 20px;
	color: var(--text-light);
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--sec);
	white-space: nowrap;
	padding: 0 10px;
	text-align: center;
	padding-bottom: 2px;
	padding-top: 3px;

	// ASAP2025
	background: #282828;
	font-family: Noto Sans;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

export function TickerTitle(props: Props) {
	return (
		<TickerTitleContainer className={props.className} style={props.style}>
			{props.children}
			<img src={ASAP25TickerArrow} style={{ marginLeft: 16, marginBottom: -2 }} />
		</TickerTitleContainer>
	);
}
