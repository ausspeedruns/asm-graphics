import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '../../types/OverlayProps';

import { IVerticalStyling, VerticalInfo } from '../elements/info-box/vertical';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';

import StandardBG from '../media/pixel/Standard.png';

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
	position: absolute;
	bottom: 0;
	width: 100%;
`;

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 664px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 65%;
	/* height: 264px; */
	flex-grow: 1;
	padding-bottom: 46px;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

const TwitterSize = {
	height: 200,
	width: 480,
	marginTop: -44,
};

const VerticalInfoS = styled(VerticalInfo)`
	height: 280px;
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
				<Background src={StandardBG} />
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
