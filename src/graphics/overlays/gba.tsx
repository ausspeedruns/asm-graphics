import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import DreamhackLogo from "../elements/event-specific/dh-24/DreamHack_Logo_RGB_WHITE.png";
import GBABG from "../elements/event-specific/dh-24/Standard.png";

const TGXBox = styled.div`
	border-style: solid;
	border-width: 10px;
	position: absolute;
	height: 110px;
	width: 110px;
	background-color: var(--main);
`;

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

const SponsorsBoxS = styled(SponsorsBox)`
	width: 100%;
	flex-grow: 1;
`;

const SponsorsStyled = {
	height: 200,
	width: 340,
};

const InfoBoxBG = styled.div`
	position: relative;
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 664px;

	& > div {
		z-index: 1;
	}
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
	mainStyle: {
		height: 310,
	},
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
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
				/>
				<InfoBoxBG>
					<img src={GBABG} style={{ position: "absolute", width: "100%", bottom: 0, zIndex: 0 }} />
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch commentators={props.commentators} host={props.host} audio={props.microphoneAudioIndicator} />

					<img src={DreamhackLogo} style={{ width: "80%", zIndex: 1 }} />
					{/* <SponsorsBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorsStyled}
						tweetStyle={TwitterSize}
					/> */}
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
});

GBA.displayName = "GBA";
