import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import { OverlayProps, OverlayRef } from '@asm-graphics/types/OverlayProps';

import { WideInfo } from '../elements/info-box/wide';
import { Facecam } from '../elements/facecam';
import { SponsorBoxRef, SponsorsBox } from '../elements/sponsors';
import { Couch } from '../elements/couch';
import { Egg } from '../elements/greeble/tgx/egg';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const TopBar = styled.div`
	height: 157px;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
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

const SidebarBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 446.5px;
	padding-top: 14px;
	/* border-top: 1px solid var(--sec); */
	overflow: hidden;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
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

// TGX EGGS
const RedEgg = styled(Egg)`
	position: absolute;
	transform: rotate(-92deg);
	top: 26px;
    left: 1803px;
    z-index: 2;
`;

const YellowEgg = styled(Egg)`
	position: absolute;
	transform: rotate(140deg);
    top: -168px;
    left: -29px;
    z-index: 2;
`;

const BlueEgg = styled(Egg)`
	position: absolute;
	transform: rotate(72deg);
    top: 314px;
    left: -172px;
`;

const GreenEgg = styled(Egg)`
	position: absolute;
	transform: rotate(-19deg);
    top: 745px;
    left: 229px;
`;

export const Widescreen = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	return (
		<WidescreenContainer>
			<TopBar>
				<RedEgg colour="Red" />
				<YellowEgg colour="Yellow" />
				<WideInfo timer={props.timer} runData={props.runData} />
				<TGXDivider
					style={{
						position: 'absolute',
						top: 156,
						width: 1920,
					}}
				/>
			</TopBar>
			<Sidebar>
				<Facecam
					maxNameWidth={270}
					height={400}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.obsAudioIndicator}
					verticalCoop
				/>
				<TGXDivider />
				<SidebarBG>
					<BlueEgg colour="Blue" />
					<GreenEgg colour="Green" />
					<Couch couch={props.couchInformation} audio={props.obsAudioIndicator} />
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
