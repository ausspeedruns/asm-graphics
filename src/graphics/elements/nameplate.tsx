import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

// @ts-ignore
import TwitchLogo from '../media/TwitchGlitchPurple.svg';
import { RunDataPlayer } from '../../types/RunData';

const NameplateContainer = styled.div`
	background: #ffffff;
	color: #000000;
	width: 100%;
	height: 41px;
	font-size: 30px;
	font-family: Noto Sans;

	display: flex;
	flex-direction: ${(props: NameplateSide) => props.nameplateLeft ? 'row-reverse': 'row'};
	justify-content: space-between;
	align-items: center;
`;

const Names = styled.div`
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`;

const NormalName = styled.span``;

const TwitchDiv = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
`;

const PronounBox = styled.div`
	background: var(--sec-col);
	font-family: Work Sans;
	font-weight: 400;
	font-size: 20px;
	text-transform: uppercase;
	color: #ffffff;
	padding: 0 8px;
	height: 100%;
	display: flex;
	align-items: center;
`;

interface Props {
	player: RunDataPlayer;
	nameplateLeft?: boolean;
	style?: React.CSSProperties;
	className?: string;
}

interface NameplateSide {
	nameplateLeft?: boolean;
}

// How many seconds it takes to fade between twitch and normal name
const nameLoopLength = 90;

export const Nameplate: React.FC<Props> = (props: Props) => {
	const normalNameEl = useRef<HTMLSpanElement>(null);
	const twitchNameEl = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Only loop if twitch name exists and if they are different, if the same then just display twitch
		if (
			props.player.social.twitch &&
			props.player.name !== props.player.social.twitch
		) {
			const tl = gsap.timeline({
				repeat: -1,
				repeatDelay: nameLoopLength,
			});
			tl.set(normalNameEl.current, { opacity: 1 });
			tl.to(normalNameEl.current, { opacity: 0, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 1, duration: 1 });
			tl.to(
				twitchNameEl.current,
				{ opacity: 0, duration: 1 },
				`+=${nameLoopLength}`,
			);
			tl.to(normalNameEl.current, { opacity: 1, duration: 1 });
		}
	}, [props.player.name, props.player.social.twitch]);

	const sameNameAndTwitch = props.player.name === props.player.social.twitch;

	return (
		<NameplateContainer style={props.style} className={props.className} nameplateLeft={props.nameplateLeft}>
			<Names>
				<NormalName
					ref={normalNameEl}
					style={{ opacity: sameNameAndTwitch ? 0 : 1 }}>
					{props.player.name}
				</NormalName>
				<TwitchDiv
					ref={twitchNameEl}
					style={{ opacity: sameNameAndTwitch ? 1 : 0 }}>
					<TwitchLogo
						style={{ height: 30, width: 'auto', marginRight: 13 }}
					/>
					<NormalName>{props.player.social.twitch}</NormalName>
				</TwitchDiv>
			</Names>
			<PronounBox>{props.player.pronouns}</PronounBox>
		</NameplateContainer>
	);
};
