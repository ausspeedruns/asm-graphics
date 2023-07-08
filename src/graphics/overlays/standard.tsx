import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '@asm-graphics/types/OverlayProps';

import { IVerticalStyling, VerticalInfo } from '../elements/info-box/vertical';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';

import StandardBG from '../media/ASM23/standard.png';

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 664px;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* width: 65%; */
	/* height: 264px; */
	flex-grow: 1;
	margin-top: -70px;
`;

const SponsorsSize = {
	height: 125,
	width: 480,
};

const TwitterSize = {
	height: 200,
	width: 480,
	marginTop: -44,
};

const VerticalInfoS = styled(VerticalInfo)`
	height: 348px;
`;

const customVerticalStyle: IVerticalStyling = {
	timerSize: 75,
	gameInfoSize: 20,
	gameTitleSize: 40,
	gameStackHeight: 100,
	timerStackHeight: 200,
	categorySize: 38,
};

export const Standard = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<StandardContainer>
			<Sidebar>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.obsAudioIndicator}
					verticalCoop
				/>
				<InfoBoxBG>
					<img
						src={StandardBG}
						style={{ position: 'absolute', height: 'auto', width: '100%', objectFit: 'contain', bottom: 0 }}
					/>
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch style={{ zIndex: 3 }} couch={props.couchInformation} audio={props.obsAudioIndicator} />
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
