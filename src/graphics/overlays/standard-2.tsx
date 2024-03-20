import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, ISmallStyling } from "../elements/info-box/small";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";
import { TGX24Rainbow } from "../elements/event-specific/tgx-24/tgx24";

// import StandardLeft from "../media/ASM23/standard-2-left.png";
// import StandardRight from "../media/ASM23/standard-2-right.png";
import tgxBackgroundPattern from "../elements/event-specific/tgx-24/pattern.png";

const TGXBox = styled.div`
	border-style: solid;
	border-width: 10px;
	position: absolute;
	height: 100px;
	width: 100px;
	background-color: var(--main);
`;

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 295px;
	width: 1920px;
	/* border-bottom: 1px solid var(--sec); */
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	background: var(--main);
	position: relative;
	background-image: url(${tgxBackgroundPattern});
	background-blend-mode: multiply;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: var(--main);
	position: relative;
	background-image: url(${tgxBackgroundPattern});
	background-blend-mode: multiply;
`;

const SponsorSize = {
	height: 230,
	width: 440,
	marginRight: -40,
};

const TwitterSize = {
	height: 220,
	width: 420,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 720px;
	width: 2px;
	position: absolute;
	top: 296px;
	left: 959px;
	background: var(--sec);
`;

const customSmallStyling: ISmallStyling = {
	categoryWidth: 260,
	timerStackHeight: 100,
	lowerStackHeight: 100,
	// gameNameBottomMargin: -40,
	mainStyle: {
		height: "100%",
		width: "100%",
		zIndex: 1,
		padding: 0,
	},
	lowerStackStyle: {
		justifyContent: "space-between",
	},
	timerStyle: {
		flexGrow: 1,
	},
	gameNameStyle: {
		lineHeight: "42px",
	},
	categoryStyle: {
		width: 284,
	},
};

export const Standard2 = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Standard2Container>
			<Topbar>
				<LeftBox>
					{/* <img
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
						src={StandardLeft}
					/> */}
					<TGXBox
						style={{
							borderColor: "var(--tgx-blue)",
							transform: "translate(-50%, -50%) rotate(45deg)",
							top: 0,
							left: 0,
						}}
					/>
					<TGXBox
						style={{
							borderColor: "var(--tgx-green)",
							transform: "translate(-50%, 50%) rotate(45deg)",
							bottom: 10,
							left: 0,
						}}
					/>

					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="left"
					style={{ position: "absolute", top: 255, left: 625 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === 1}
					side="right"
					style={{
						position: "absolute",
						top: 255,
						right: 625,
						zIndex: 2,
					}}
				/>

				<TGX24Rainbow style={{ position: "absolute", height: 10, width: 1920, top: 286 }} />

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<TGX24Rainbow style={{ position: "absolute", height: 1, width: 1920, top: 294, zIndex: 3 }} />

				<RaceFinish style={{ top: 219, left: 830 }} time={teamData[0].time} place={teamData[0].place} />
				<RaceFinish style={{ top: 219, left: 960 }} time={teamData[1].time} place={teamData[1].place} />

				<RightBox>
					{/* <img
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
						src={StandardRight}
					/> */}
					<TGXBox
						style={{
							borderColor: "var(--tgx-yellow)",
							transform: "translate(50%, -50%) rotate(45deg)",
							top: 0,
							right: 0,
						}}
					/>
					<TGXBox
						style={{
							borderColor: "var(--tgx-red)",
							transform: "translate(50%, 50%) rotate(45deg)",
							bottom: 10,
							right: 0,
						}}
					/>

					<div
						style={{
							display: "flex",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
						}}>
						<Couch
							commentators={props.commentators}
							host={props.host}
							style={{ width: "30%", zIndex: 3 }}
							audio={props.microphoneAudioIndicator}
						/>
						<SponsorsBox
							ref={sponsorRef}
							sponsors={props.sponsors}
							style={{ flexGrow: 1 }}
							sponsorStyle={SponsorSize}
							tweetStyle={TwitterSize}
						/>
					</div>
				</RightBox>
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
});

Standard2.displayName = "Standard2";
