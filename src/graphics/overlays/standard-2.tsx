import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

// import { SmallInfo, ISmallStyling } from "../elements/info-box/small";
import { SmallInfo, ISmallStyling } from "../elements/info-box/small-asap25";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import Standard2p from "./backgrounds/Standard2p.png";

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
	// background: var(--main);
	position: relative;
	box-sizing: border-box;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	/* background: var(--main); */
	position: relative;
	z-index: 2;
	box-sizing: border-box;
`;

const SponsorSize = {
	height: 230,
	width: 360,
	// marginRight: -40,
};

const CentralDivider = styled.div`
	height: 720px;
	width: 2px;
	position: absolute;
	top: 296px;
	left: 959px;
	background: var(--sec);

	// ASAP2025
	background: #fff;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 0 0 H 666 V 295 H 0 Z M 1920 0 H 1254 V 295 H 1921 Z ");
	// background: var(--main);
	z-index: 1;
`;

const customSmallStyling = {
	categoryWidth: 590,
	timerStackHeight: 100,
	gameInfoFontSize: 60,
	// gameNameBottomMargin: -40,
	mainStyle: {
		height: "100%",
		width: "100%",
		zIndex: 2,
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
		fontSize: 30,
	},
	categoryStyle: {
		marginTop: 15,
	},
	gameStackHeight: 148,
	estimateFontSize: 70,
	estimateStyle: {
		lineHeight: "29px",
	},
} as const satisfies ISmallStyling;

export const Standard2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Standard2Container>
			<WholeGraphicClip>
				<img style={{ position: "absolute", width: "100%" }} src={Standard2p} />
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="left"
					style={{
						position: "absolute",
						top: 255,
						left: 625,
						zIndex: 2,
					}}
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

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--accent)",
						borderLeft: "1px solid var(--accent)",
						zIndex: 2,
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 219, left: 830 }} time={teamData[0].time} place={teamData[0].place} />
				<RaceFinish style={{ top: 219, left: 960 }} time={teamData[1].time} place={teamData[1].place} />

				<RightBox>
					<div
						style={{
							display: "flex",
							width: "100%",
							height: "100%",
							justifyContent: "space-around",
							alignItems: "center",
							zIndex: 2,
						}}
					>
						<Couch
							commentators={props.commentators}
							host={props.host}
							style={{ width: "30%", zIndex: 3, marginLeft: 12 }}
							audio={props.microphoneAudioIndicator}
							align="center"
						/>
						<SponsorsBox
							sponsors={props.sponsors}
							style={{
								width: "60%",
								background: "#000",
								borderRadius: 35,
								boxShadow: "inset 9px 7px 4px rgba(221, 221, 221, 0.25), inset 0px -4px 4px #fff",
								marginBottom: 24,
							}}
							sponsorStyle={SponsorSize}
						/>
					</div>
				</RightBox>
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
};
