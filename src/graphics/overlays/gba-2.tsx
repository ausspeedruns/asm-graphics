import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, ISmallStyling } from "../elements/info-box/small-asap25";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import GBA2p from "./backgrounds/GBA2p.png";

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 341px;
	width: 1920px;
	border-bottom: 1px solid white;
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	position: relative;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
`;

const SponsorSize = {
	height: 230,
	width: 400,
};

const CentralDivider = styled.div`
	height: 590px;
	width: 2px;
	position: absolute;
	top: 341px;
	left: 959px;
	background: white;
`;

const customSmallStyling: ISmallStyling = {
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
};

export const GBA2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Standard2Container>
			<img src={GBA2p} style={{ position: "absolute", height: "100%", width: "100%" }} />

			<Topbar>
				<LeftBox>
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

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--asm-orange)",
						borderLeft: "1px solid var(--asm-orange)",
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 220, left: 830 }} time={teamData[0].time} place={teamData[0].place} />
				<RaceFinish style={{ top: 220, left: 960 }} time={teamData[0].time} place={teamData[0].place} />

				<RightBox>
					<div
						style={{
							display: "flex",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
							gap: 16,
							padding: 16,
							boxSizing: "border-box",
						}}
					>
						<Couch
							commentators={props.commentators}
							host={props.host}
							style={{ width: "30%", zIndex: 3 }}
							audio={props.microphoneAudioIndicator}
						/>
						<SponsorsBox
							sponsors={props.sponsors}
							style={{
								flexGrow: 1,
								background: "#000",
								borderRadius: 35,
								boxShadow: "inset 9px 7px 4px rgba(221, 221, 221, 0.25), inset 0px -4px 4px #fff",
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
