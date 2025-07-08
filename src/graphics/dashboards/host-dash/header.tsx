import styled from "styled-components";

const HeaderContainer = styled.div`
	height: 100%;
	font-weight: bold;
	font-size: 16px;
	width: 100%;
	background: var(--panel-background);
	color: var(--text-color);

	transition: background 0.25s;

	display: flex;
	padding-left: 32px;
	border-radius: 0px;

	align-items: center;
`;

interface Props {
	text: string;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	children?: React.ReactNode;
	draggable?: boolean;
}

export function Header(props: Props) {
	return (
		<HeaderContainer style={props.style} onClick={props.onClick} draggable={props.draggable}>
			<h3>{props.text}</h3>
		</HeaderContainer>
	);
}
