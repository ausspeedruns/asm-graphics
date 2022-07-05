import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

// @ts-ignore
import TwitchLogo from '../media/TwitchGlitchPurple.svg';
import { RunDataPlayer } from '../../types/RunData';

import { FitText } from './fit-text';

const NameplateContainer = styled.div`
	background: #ffffff;
	color: var(--text-dark);
	width: 100%;
	height: 41px;
	font-size: 30px;
	font-family: Noto Sans;

	display: flex;
	flex-direction: ${(props: NameplateSide) => (props.nameplateLeft ? 'row-reverse' : 'row')};
	justify-content: space-between;
	align-items: center;
`;

const Names = styled.div`
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`;

const NormalName = styled(FitText)``;

const TwitchDiv = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
`;

const PronounBox = styled.div`
	background: var(--sec);
	font-family: Noto Sans;
	font-weight: 400;
	font-size: 20px;
	text-transform: uppercase;
	color: var(--text-light);
	padding: 0 8px;
	height: 100%;
	display: flex;
	align-items: center;
`;

const TwitchLogoImg = styled.img`
	height: 30px;
	width: auto;
	margin-right: 13px;
`;

interface Props {
	player: RunDataPlayer;
	nameplateLeft?: boolean;
	maxWidth?: number;
	icon?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
}

interface NameplateSide {
	nameplateLeft?: boolean;
}

// How many seconds it takes to fade between twitch and normal name
const nameLoopLength = 90;

export const Nameplate: React.FC<Props> = (props: Props) => {
	const normalNameEl = useRef<HTMLDivElement>(null);
	const twitchNameEl = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Only loop if twitch name exists and if they are different, if the same then just display twitch
		if (props.player.social.twitch && props.player.name !== props.player.social.twitch) {
			const tl = gsap.timeline({
				repeat: -1,
				repeatDelay: nameLoopLength,
			});
			tl.set(normalNameEl.current, { opacity: 1 });
			tl.to(normalNameEl.current, { opacity: 0, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 1, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 0, duration: 1 }, `+=${nameLoopLength}`);
			tl.to(normalNameEl.current, { opacity: 1, duration: 1 });
		}
	}, [props.player.name, props.player.social.twitch]);

	const sameNameAndTwitch = props.player.name === props.player.social.twitch;

	return (
		<NameplateContainer style={props.style} className={props.className} nameplateLeft={props.nameplateLeft}>
			{props.icon}
			<Names>
				<div ref={normalNameEl} style={{ opacity: sameNameAndTwitch ? 0 : 1 }}>
					<NormalName style={{ maxWidth: props.maxWidth }} text={props.player.name} />
				</div>
				<TwitchDiv ref={twitchNameEl} style={{ opacity: sameNameAndTwitch ? 1 : 0 }}>
					<TwitchLogoImg src={TwitchLogo} />

					<div>
						<NormalName
							style={{ maxWidth: (props.maxWidth || 9999) - 45 }}
							text={props.player.social.twitch || ''}
						/>
					</div>
				</TwitchDiv>
			</Names>
			{props.player.pronouns && (
				<PronounBox>
					<FitText style={{ maxWidth: (props.maxWidth || 9999) * 0.45 }} text={props.player.pronouns} />
				</PronounBox>
			)}
		</NameplateContainer>
	);
};
