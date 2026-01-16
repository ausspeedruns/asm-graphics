import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import { VerticalTimerBottomInfo } from "../elements/info-box/vertical-timer-bottom";

const StandardWidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 400px;
	width: 1920px;
	/* border-bottom: 1px solid var(--sec); */
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 524px;
	height: 100%;
	display: flex;
	// background: var(--main);
	position: relative;
	box-sizing: border-box;
	background: var(--main);
`;

const RightBox = styled.div`
	width: 796px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	/* background: var(--main); */
	position: relative;
	z-index: 2;
	box-sizing: border-box;
	background: var(--main);
`;

const SponsorSize = {
	height: 230,
	width: 360,
	// marginRight: -40,
};

const CentralDivider = styled.div`
	height: 618px;
	width: 1px;
	position: absolute;
	bottom: 0;
	left: 823px;
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
					width={598}
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
					<VerticalTimerBottomInfo timer={props.timer} runData={props.runData} />
				</RightBox>
			</Topbar>
			<CentralDivider />
		</StandardWidescreenContainer>
	);
};
