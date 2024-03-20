import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

// import GBABG from "../media/ASM23/gba.png";
import { TGX24Rainbow } from "../elements/event-specific/tgx-24/tgx24";
import tgxBackgroundPattern from "../elements/event-specific/tgx-24/pattern.png";

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
	height: 664px;
	background-image: url(${tgxBackgroundPattern});
	background-repeat: repeat;
	background-blend-mode: multiply;
	background-position-y: 10px;
	clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
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
					{/* <img
						src={GBABG}
						style={{ position: "absolute", height: "auto", width: "100%", objectFit: "contain", bottom: 0 }}
					/> */}
					<TGXBox
						style={{
							borderColor: "var(--tgx-blue)",
							transform: "translate(-50%, -50%) rotate(45deg)",
							top: 0,
							left: 0,
							marginTop: 10,
						}}
					/>
					<TGXBox
						style={{
							borderColor: "var(--tgx-yellow)",
							transform: "translate(50%, -50%) rotate(45deg)",
							top: 0,
							right: 0,
							marginTop: 10,
						}}
					/>
					<TGXBox
						style={{
							borderColor: "var(--tgx-red)",
							transform: "translate(50%, 50%) rotate(45deg)",
							bottom: 0,
							right: 0,
						}}
					/>
					<TGXBox
						style={{
							borderColor: "var(--tgx-green)",
							transform: "translate(-50%, 50%) rotate(45deg)",
							bottom: 0,
							left: 0,
						}}
					/>
					<TGX24Rainbow style={{ height: 10, width: "100%", zIndex: 2, position: "absolute", top: 0 }} />
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch commentators={props.commentators} host={props.host} audio={props.microphoneAudioIndicator} />
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
