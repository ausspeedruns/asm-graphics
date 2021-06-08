import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

// @ts-ignore
import TwitchLogo from '../media/TwitchGlitchPurple.svg';

const NameplateContainer = styled.div`
	background: #ffffff;
	color: #000000;
	width: 100%;
	font-size: 30px;
	font-family: Noto Sans;

	display: flex;
	justify-content: center;
	align-items: center;
`;

const NormalName = styled.span``;

const TwitchDiv = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
`;

interface Props {
	name: string;
	twitch?: string;
	style?: React.CSSProperties;
	className?: string;
}

// How many seconds it takes to fade between twitch and normal name
const nameLoopLength = 90;

export const Nameplate: React.FC<Props> = (props: Props) => {
	const normalNameEl = useRef<HTMLSpanElement>(null);
	const twitchNameEl = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Only loop if twitch name exists and if they are different, if the same then just display twitch
		if (props.twitch && props.name !== props.twitch) {
			const tl = gsap.timeline({ repeat: -1, repeatDelay: nameLoopLength });
			tl.set(normalNameEl.current, { opacity: 1 });
			tl.to(normalNameEl.current, { opacity: 0, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 1, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 0, duration: 1 }, `+=${nameLoopLength}`);
			tl.to(normalNameEl.current, { opacity: 1, duration: 1 });
		}
	}, [props.name, props.twitch]);

	const sameNameAndTwitch = props.name === props.twitch;

	return (
		<NameplateContainer style={props.style} className={props.className}>
			<NormalName ref={normalNameEl} style={{ opacity: sameNameAndTwitch ? 0 : 1 }}>
				{props.name}
			</NormalName>
			<TwitchDiv ref={twitchNameEl} style={{ opacity: sameNameAndTwitch ? 1 : 0 }}>
				<TwitchLogo style={{ height: 30, width: 'auto', marginRight: 13 }} />
				<NormalName>{props.twitch}</NormalName>
			</TwitchDiv>
		</NameplateContainer>
	);
};
