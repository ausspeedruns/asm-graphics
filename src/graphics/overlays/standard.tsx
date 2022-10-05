import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '../../types/OverlayProps';

import { IVerticalStyling, VerticalInfo } from '../elements/info-box/vertical';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';

import StarsBG from '../media/Stars.png';
import { PaxCircles } from '../elements/pax-circles';

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
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
	clip-path: path('M0 180H2000V1080H0Z');
`;

const InfoBoxBG = styled.div`
	border-top: 1px solid var(--sec);
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 664px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* width: 65%; */
	/* height: 264px; */
	flex-grow: 1;
`;

const SponsorsSize = {
	height: 200,
	width: 480,
};

const TwitterSize = {
	height: 200,
	width: 480,
	marginTop: -44,
};

const VerticalInfoS = styled(VerticalInfo)`
	height: 300px;
	margin: 10px 0;
`;

const customVerticalStyle: IVerticalStyling = {
	mainStyle: { marginBottom: 10 },
	timerSize: 75,
	gameInfoSize: 20,
	gameTitleSize: 30,
	gameStackHeight: 100,
	timerStackHeight: 200,
};

export const Standard = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	return (
		<StandardContainer>
			<Sidebar>
				{/* <div style={{ position: 'absolute', bottom: 0 }}> */}
				<PAXCirclesStandard />
				{/* </div> */}
				<Background src={StarsBG} />
				<Background2 src={StarsBG} />
				<PAXGlow />
				<Facecam
					maxNameWidth={400}
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
					audioIndicator={props.obsAudioIndicator}
				/>
				<InfoBoxBG>
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch
						couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
						audio={props.obsAudioIndicator}
					/>
					<SponsorBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorsSize}
						tweetStyle={TwitterSize}
					/>
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
});
