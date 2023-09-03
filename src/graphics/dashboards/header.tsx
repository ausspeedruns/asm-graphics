import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
	height: 40px;
	font-weight: bold;
	line-height: 40px;
	text-transform: uppercase;
	width: 100%;
	background: #c7c7c7;

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
		<HeaderContainer style={props.style} onClick={props.onClick}>
			{props.text}
			{props.children}
		</HeaderContainer>
	);
};
