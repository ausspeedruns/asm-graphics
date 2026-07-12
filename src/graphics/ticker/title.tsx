import styled from "@emotion/styled";

const TickerTitleContainer = styled.div`
	height: 100%;
	font-family: var(--secondary-font);
	font-size: 20px;
	color: var(--text-light);
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--time-colour);
	white-space: nowrap;
	padding: 0 10px;
	text-align: center;
	line-height: 1;
	text-transform: uppercase;
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
		</TickerTitleContainer>
	);
}
