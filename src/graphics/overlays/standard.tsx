import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { IVerticalStyling, VerticalInfo } from "../elements/info-box/vertical";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { TGX24Rainbow } from "../elements/event-specific/tgx-24/tgx24";

import tgxBackgroundPattern from "../elements/event-specific/tgx-24/pattern.png";
// import StandardBG from "../media/ASM23/standard.png";

const TGXBox = styled.div`
	border-style: solid;
	border-width: 10px;
	position: absolute;
	height: 145px;
	width: 145px;
	background-color: var(--main);
`;

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--accent);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 664px;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-image: url(${tgxBackgroundPattern});
	background-blend-mode: multiply;
	background-repeat: repeat;
	background-position-y: 10px;
	position: relative;
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* width: 65%; */
	/* height: 264px; */
	flex-grow: 1;
	/* margin-top: -70px; */
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
	z-index: 1;
`;

const customVerticalStyle: IVerticalStyling = {
	timerSize: 75,
	gameInfoSize: 20,
	gameTitleSize: 40,
	gameStackHeight: 200,
	timerStackHeight: 300,
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
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<InfoBoxBG>
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
					{/* <img
						src={StandardBG}
						style={{ position: "absolute", height: "auto", width: "100%", objectFit: "contain", bottom: 0 }}
					/> */}
					<TGX24Rainbow style={{ width: "100%", zIndex: 2, position: "absolute", top: 0 }} />
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch
						style={{ zIndex: 3 }}
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
					/>
					{/*<SponsorBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorsSize}
						tweetStyle={TwitterSize}
					/>*/}
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
});

Standard.displayName = "Standard";
