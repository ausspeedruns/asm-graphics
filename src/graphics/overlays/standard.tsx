import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '@asm-graphics/types/OverlayProps';

import { IVerticalStyling, VerticalInfo } from '../elements/info-box/vertical';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';
import { Egg } from '../elements/greeble/tgx/egg';

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

const TGXDivider = styled.div`
	height: 1px;
	background: linear-gradient(
		90deg,
		var(--tgx-red) 0%,
		var(--tgx-red) 25%,
		var(--tgx-yellow) 25%,
		var(--tgx-yellow) 50%,
		var(--tgx-blue) 50%,
		var(--tgx-blue) 75%,
		var(--tgx-green) 75%,
		var(--tgx-green) 100%
	);
`;

const InfoBoxBG = styled.div`
	/* border-top: 1px solid var(--sec); */
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

// TGX EGGS
const RedEgg = styled(Egg)`
	position: absolute;
	transform: rotate(-49deg);
	top: 687px;
	left: 503px;
`;

const YellowEgg = styled(Egg)`
	position: absolute;
	transform: rotate(169deg);
	top: 122px;
    left: 371px;
`;

const BlueEgg = styled(Egg)`
	position: absolute;
	transform: rotate(130deg);
	top: 364px;
	left: -182px;
	z-index: -1;
`;

const GreenEgg = styled(Egg)`
	position: absolute;
	transform: rotate(32deg);
	top: 825px;
    left: -171px;
`;

export const Standard = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	console.log(JSON.stringify(props.obsAudioIndicator));
	// console.log(props.runData?.teams)

	return (
		<StandardContainer>
			<Sidebar>
				<Facecam
					maxNameWidth={400}
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.obsAudioIndicator}
					verticalCoop
				/>
				<TGXDivider />
				<InfoBoxBG>
					<RedEgg colour='Red' />
					<YellowEgg colour='Yellow' />
					<BlueEgg colour='Blue' />
					<GreenEgg colour='Green' />
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch couch={props.couchInformation} audio={props.obsAudioIndicator} />
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
