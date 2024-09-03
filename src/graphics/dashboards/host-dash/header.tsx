import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
	height: 100%;
	font-weight: bold;
	text-transform: uppercase;
	width: 100%;
	background: #cc7722;
	color: white;

	display: flex;

	justify-content: center;

	align-items: center;
`;

const DestyledLink = styled.a`
	color: inherit;
	text-decoration: none;
`;

interface Props {
	text: string;
	url?: string;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	children?: React.ReactNode;
	draggable?: boolean;
}

export const Header: React.FC<Props> = (props: React.PropsWithChildren<Props>) => {
	if (props.url) {
		return (
			<HeaderContainer style={props.style}>
				<DestyledLink href={props.url} target="blank">
					{props.text}
				</DestyledLink>
				{props.children}
			</HeaderContainer>
		);
	}

	return (
		<HeaderContainer style={props.style} onClick={props.onClick} draggable={props.draggable}>
			{props.text}
			{props.children}
		</HeaderContainer>
	);
};
