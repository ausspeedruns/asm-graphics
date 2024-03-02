import React from "react";
import styled from "styled-components";

interface GenericProps {
	className?: string;
	style?: React.CSSProperties;
}

/********************************** RAINBOW **********************************/

const TGX24RainbowContainer = styled.div`
	background: var(--tgx-rainbow-bar);
	z-index: 2;
	height: 10px;
`;

export const TGX24Rainbow = (props: GenericProps) => {
	return <TGX24RainbowContainer className={props.className} style={props.style} />;
};

/********************************** SQUARES **********************************/

const TGX24SquaresContainer = styled.div`
	z-index: 2;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 20px;
	transform: rotate(45deg);
`;

const Square = styled.div`
	height: 85px;
	width: 85px;
`;

export const TGX24Squares = (props: GenericProps) => {
	return <TGX24SquaresContainer className={props.className} style={props.style}>
		<Square style={{backgroundColor: "var(--tgx-red)"}} />
		<Square style={{backgroundColor: "var(--tgx-green)"}} />
		<Square style={{backgroundColor: "var(--tgx-blue)"}} />
		<Square style={{backgroundColor: "var(--tgx-yellow)"}} />
	</TGX24SquaresContainer>;
};

/********************************** COLOUR ARRAY **********************************/

export const TGX24_COLOURS = [
	{background: "var(--tgx-red)", color: "var(--text-light)"},
	{background: "var(--tgx-yellow)", color: "var(--text-light)"},
	{background: "var(--tgx-blue)", color: "var(--text-light)"},
	{background: "var(--tgx-green)", color: "var(--text-light)"},
];
