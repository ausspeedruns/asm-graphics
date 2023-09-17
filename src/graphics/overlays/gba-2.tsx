import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import type { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, ISmallStyling } from "../elements/info-box/small";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import GBALeft from "../media/ASM23/gba-2-left.png";
import GBARight from "../media/ASM23/gba-2-right.png";

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 376px;
	width: 1920px;
	border-bottom: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	background: var(--main);
	position: relative;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: var(--main);
	position: relative;
`;

const SponsorSize = {
	height: 230,
	width: 430,
	marginRight: -40,
};

const TwitterSize = {
	height: 220,
	width: 420,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 639px;
	width: 2px;
	position: absolute;
	top: 377px;
	left: 959px;
	background: var(--asm-orange);
`;

const customSmallStyling: ISmallStyling = {
	categoryWidth: 265,
	timerStackHeight: 188,
	lowerStackHeight: 188,
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

export const GBA2 = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	const { teamData, gameAudioActive } = getTeams(props.runData, props.timer, props.audioIndicator, 2);

	return (
		<Standard2Container>
			<Topbar>
				<LeftBox>
					<img
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
						src={GBALeft}
					/>
					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

				<AudioIndicator
					active={gameAudioActive === 0}
					side="left"
					style={{ position: "absolute", top: 255, left: 625 }}
				/>
				<AudioIndicator
					active={gameAudioActive === 1}
					side="right"
					style={{
						position: "absolute",
						top: 255,
						right: 625,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--asm-orange)",
						borderLeft: "1px solid var(--asm-orange)",
					}}
					teams={props.runData?.teams}
					audioIndicator={props.obsAudioIndicator}
				/>

				<RaceFinish style={{ top: 220, left: 830 }} time={teamData[0].time} place={teamData[0].place} />
				<RaceFinish style={{ top: 220, left: 960 }} time={teamData[0].time} place={teamData[0].place} />

				<RightBox>
					<img
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
						src={GBARight}
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
							audio={props.obsAudioIndicator}
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

GBA2.displayName = "GBA2";
