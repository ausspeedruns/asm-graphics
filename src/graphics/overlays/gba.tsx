import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '../../types/OverlayProps';

import { VerticalInfo, IVerticalStyling } from '../elements/info-box/vertical';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';

import StarsBG from '../media/Stars.png';
import { PaxCircles } from '../elements/pax-circles';

const GBAContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 395px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
`;


const Background = styled.img`
	mix-blend-mode: screen;
	position: absolute;
	bottom: 20px;
	width: 200%;
	transform-origin: center;
	transform: translateY(50%);
`;

const Background2 = styled(Background)`
	right: 0;
`;

const PAXGlow = styled.div`
	position: absolute;
	width: 1114px;
	height: 673px;
	left: -274px;
	bottom: 0;
	transform-origin: center;
	transform: translateY(50%);

	background: radial-gradient(50% 50% at 50% 50%, rgba(255, 198, 41, 0.96) 0%, rgba(255, 198, 41, 0) 100%);
	background-blend-mode: screen;
	mix-blend-mode: screen;
	opacity: 0.5;
`;

const PAXCirclesStandard = styled(PaxCircles)`
	position: absolute;
	width: 300%;
	bottom: 0;
	display: flex;
	justify-content: center;
	transform: translate(-33.5%, 50%);
`;

const SponsorsBoxS = styled(SponsorsBox)`
	width: 100%;
	flex-grow: 1;
`;

const SponsorsStyled = {
	height: 200,
	width: 340,
};

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const TwitterSize = {
	height: 158,
	width: 395,
	marginTop: -44,
	fontSize: 14,
};

const customVerticalStyle: IVerticalStyling = {
	maxTextWidth: 360,
	gameTitleSize: 35,
	timerSize: 60,
};

export const GBA = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	return (
		<GBAContainer>
			<Sidebar>
				<PAXCirclesStandard />
				<Background src={StarsBG} />
				<Background2 src={StarsBG} />
				<PAXGlow />
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
					audioIndicator={props.obsAudioIndicator}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />

					<Couch
						couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
						audio={props.obsAudioIndicator}
					/>
					<SponsorsBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorsStyled}
						tweetStyle={TwitterSize}
					/>
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
});
