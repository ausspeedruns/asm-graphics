import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '@asm-graphics/types/OverlayProps';

import { WideInfo } from '../elements/info-box/wide';
import { Facecam } from '../elements/facecam';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Couch } from '../elements/couch';

import Stars from '../media/PAXStarsWidescreen.png';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 156px;
	height: 860px;
	width: 390px;
	border-right: 1px solid var(--sec);
	z-index: -1;
	overflow: hidden;
`;

const PaxGlow = styled.div`
	position: absolute;
	width: 1114px;
	height: 670px;
	left: -345px;
	bottom: 0;
	transform: translateY(50%);

	background: radial-gradient(50% 50% at 50% 50%, rgb(255, 198, 41) 0%, rgba(255, 198, 41, 0) 100%);
	background-blend-mode: screen;
	mix-blend-mode: screen;
	opacity: 0.5;
`;

const SidebarBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 446.5px;
	padding-top: 14px;
	border-top: 1px solid var(--sec);
	overflow: hidden;
`;

const PaxStars = styled.img`
	mix-blend-mode: screen;
	position: absolute;
	bottom: 0;
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* position: absolute; */
	width: 100%;
	/* height: 459px; */
	flex-grow: 1;
	/* left: 0px;
	top: 400px; */
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SponsorSize = {
	height: 250,
	width: 315,
};

const TwitterSize = {
	height: 252,
	width: 360,
	marginTop: -41,
};

export const Widescreen = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	return (
		<WidescreenContainer>
			<WideInfo timer={props.timer} runData={props.runData} />
			<Sidebar>
				<Facecam
					maxNameWidth={270}
					height={400}
					teams={props.runData?.teams}
					pronounStartSide="right"
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
					audioIndicator={props.obsAudioIndicator}
					verticalCoop
				/>
				<SidebarBG>
					<PaxStars src={Stars} />
					<PaxGlow />
					<Couch
						couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
						audio={props.obsAudioIndicator}
					/>
					<SponsorBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorSize}
						tweetStyle={TwitterSize}
					/>
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
});
