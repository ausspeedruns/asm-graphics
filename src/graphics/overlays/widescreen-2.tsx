import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";

import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import WidescreenWhole from "./backgrounds/Widescreen2p.png";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

const Widescreen2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	flex-direction: column;
	position: relative;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 1920 0 H 1254 V 341 H 1920 Z M 666 0 H 0 V 341 H 666 V 0 M 1920 882 H 0 V 1016 H 1920 Z");
	z-index: 1;
`;

const Topbar = styled.div`
	display: flex;
	height: 341px;
	width: 100%;
	overflow: hidden;
	border-bottom: 1px solid var(--sec);
`;

const LeftBox = styled(Container)`
	position: relative;
	flex: 1;
	height: 100%;
	display: flex;
	font-size: 30px;
`;

const RightBox = styled(Container)`
	position: relative;
	flex: 1;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SponsorSize = {
	height: 230,
	width: 540,
};

const ScreenContainer = styled.div`
	display: flex;
	align-items: stretch;
`;

const CentralDivider = styled.div`
	width: 2px;
	background: var(--sec);
`;

const BottomBlock = styled(Container)`
	width: 100%;
	border-top: 1px solid var(--sec);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
`;

export const Widescreen2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Widescreen2Container>
			<WholeGraphicClip>
				{/* <img src={WidescreenWhole} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</LeftBox>

				{/* TODO: Figure out a better way to link Audio Indicator to person. */}
				<AudioIndicator
					active={props.gameAudioIndicator === props.runData?.teams[0]?.players[0]?.id}
					side="right"
					style={{ position: "absolute", top: 259, left: 666, zIndex: 2 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === props.runData?.teams[1]?.players[0]?.id}
					side="left"
					style={{
						position: "absolute",
						top: 259,
						right: 666,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={588}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						zIndex: 3,
					}}
					teams={props.runData?.teams}
					maxNameWidth={190}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish
					style={{ top: 265, left: 830, zIndex: 3 }}
					time={teamData[0]?.time}
					place={teamData[0]?.place ?? -1}
				/>
				<RaceFinish
					style={{ top: 265, left: 960, zIndex: 3 }}
					time={teamData[1]?.time}
					place={teamData[1]?.place ?? -1}
				/>

				<RightBox>
					<SponsorsBox
						style={{ flexGrow: 1, zIndex: 2 }}
						sponsors={props.sponsors}
						width={SponsorSize.width}
						height={SponsorSize.height}
					/>
				</RightBox>
			</Topbar>
			<ScreenContainer>
				<GameplayCapture aspectRatio="16:9" grow />
				<CentralDivider />
				<GameplayCapture aspectRatio="16:9" grow />
			</ScreenContainer>
			<BottomBlock>
				<Couch
					commentators={props.commentators}
					audio={props.microphoneAudioIndicator}
					showHost={props.showHost}
				/>
			</BottomBlock>

			{/* <svg id="widescreen2Clip">
				<defs>
					<clipPath>
						<polygon points="667,0 1253,0, 1253,341 667,341" />
					</clipPath>
				</defs>
			</svg> */}
		</Widescreen2Container>
	);
};
