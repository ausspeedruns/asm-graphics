

import React from "react";
import styled from "styled-components";

/********************************** RAINBOW **********************************/

const PAX23RainbowContainer = styled.div`
	background: var(--pax23-rainbow-bar);
	z-index: 2;
`;

interface PAX23RainbowProps {
	className?: string;
	style?: React.CSSProperties;
}

export const PAX23Rainbow = (props: PAX23RainbowProps) => {
	return <PAX23RainbowContainer className={props.className} style={props.style} />;
};

/********************************** GRUNGE **********************************/

import grunge01 from "./grunge-01.png";

const PAX23GrungeContainer = styled.div`
	background-color: var(--pax23-sec);
	-webkit-mask-image: url(${grunge01});
	mask-image: url(${grunge01});
	-webkit-mask-position: center;
	mask-position: center;
	position: absolute;
	object-fit: cover;
	height: 100%;
	width: 100%;
	opacity: 0.6;
`;

interface PAX23GrungeProps {
	className?: string;
	style?: React.CSSProperties;
	size: string;
}

export const PAX23Grunge = (props: PAX23GrungeProps) => {
	// @ts-ignore
	return <PAX23GrungeContainer className={props.className} style={{"-webkit-mask-size": props.size, ...props.style}} />;
};

/********************************** GRUNGE **********************************/

import pax23Stripe from "./PAX Stripes.svg";

const PAX23StripeContainer = styled.img`
	/* object-fit: cover; */
`;

interface PAX23StripeProps {
	className?: string;
	style?: React.CSSProperties;
}

export const PAX23Stripe = (props: PAX23StripeProps) => {
	return <PAX23StripeContainer className={props.className} style={props.style} src={pax23Stripe} />;
};

/********************************** COLOUR ARRAY **********************************/

export const PAX23_COLOURS = [
	{background: "var(--pax23-red)", color: "var(--pax23-sec)"},
	{background: "var(--pax23-yellow)", color: "var(--pax23-main)"},
	{background: "var(--pax23-blue)", color: "var(--pax23-sec)"},
	{background: "var(--pax23-purple)", color: "var(--pax23-sec)"},
];
