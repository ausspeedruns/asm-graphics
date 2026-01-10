import styled from "@emotion/styled";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, type ISmallStyling } from "../elements/info-box/small";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import { type IVerticalStyling, VerticalTimerBottomInfo } from "../elements/info-box/vertical-timer-bottom";

const StandardWidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 407px;
	width: 1920px;
	/* border-bottom: 1px solid var(--sec); */
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 542px;
	height: 100%;
	display: flex;
	// background: var(--main);
	position: relative;
	box-sizing: border-box;
`;

const RightBox = styled.div`
	width: 791px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
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
	height: 609px;
	width: 2px;
	position: absolute;
	bottom: 0;
	left: 834px;
	background: var(--sec);
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 0 0 H 666 V 295 H 0 Z M 1920 0 H 1254 V 295 H 1921 Z ");
	// background: var(--main);
	z-index: 1;
`;

const customSmallStyling: ISmallStyling = {
	categoryWidth: 320,
	timerStackHeight: 100,
	lowerStackHeight: 100,
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
	},
	categoryStyle: {
		width: 350,
	},
	gameTitleFontSize: 60,
	gameTitleWidth: 740,
	timerSize: 90,
};

const customVerticalStyle: IVerticalStyling = {
	timerSize: 90,
	gameInfoSize: 20,
	gameTitleSize: 50,
	maxTextWidth: 700,
	gameStackHeight: 200,
	timerStackHeight: 300,
	categorySize: 38,
	mainStyle: {
		// marginTop: 40,
		zIndex: 5,
	},
};

export const StandardWidescreen = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<StandardWidescreenContainer>
			<WholeGraphicClip>
				{" "}
				{/* NOTE OUT OF DATE SINCE THIS IS FOR STANDARD 2 */}
				{/* <img
					style={{ position: "absolute", width: "100%" }}
					src={Standard2p}
				/> */}
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
							zIndex: 2,
						}}
					>
						<SponsorsBox sponsors={props.sponsors} style={{ flexGrow: 1 }} sponsorStyle={SponsorSize} />
						<Couch
							commentators={props.commentators}
							host={props.host}
							style={{ width: "100%", zIndex: 3, marginBottom: 16 }}
							audio={props.microphoneAudioIndicator}
							align="center"
						/>
					</div>
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="left"
					style={{
						position: "absolute",
						top: 407,
						left: 625,
						zIndex: 2,
					}}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === 1}
					side="right"
					style={{
						position: "absolute",
						top: 407,
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

				<RaceFinish style={{ top: 407, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place ?? -1} />
				<RaceFinish style={{ top: 407, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place ?? -1} />

				<RightBox>
					{/* <SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} /> */}
					<VerticalTimerBottomInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
				</RightBox>
			</Topbar>
			<CentralDivider />
		</StandardWidescreenContainer>
	);
};
