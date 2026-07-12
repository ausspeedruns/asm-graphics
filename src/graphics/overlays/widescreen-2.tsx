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
import { CloudScrolling } from "./aso2026/clouds";
import { ASM26Felt } from "../elements/asm26/asm26-felt";
import { ASM26Bricks } from "../elements/asm26/asm26-bricks";

const Widescreen2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 1920 0 H 1254 V 341 H 1920 Z M 666 0 H 0 V 341 H 666 V 0 M 1920 882 H 0 V 1016 H 1920 Z");
	// background: var(--main);
	z-index: 1;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 341px;
	width: 1920px;
	overflow: hidden;
	border-bottom: 1px solid var(--sec);
`;

const LeftBox = styled(ASM26Felt)`
	width: 666px;
	height: 100%;
	display: flex;
	// background: var(--main);
	position: relative;
`;

const RightBox = styled(ASM26Felt)`
	width: 666px;
	height: 100%;
	/* background: var(--main); */
	display: flex;
	flex-direction: column;
	position: relative;
	/* background: var(--main); */
	z-index: 2;
`;

const SponsorSize = {
	height: 230,
	width: 540,
};

const CentralDivider = styled.div`
	height: 540px;
	width: 2px;
	position: absolute;
	top: 341px;
	left: 959px;
	background: var(--sec);
`;

const BottomBlock = styled(ASM26Bricks)`
	position: absolute;
	top: 881px;
	height: 135px;
	width: 1920px;
	/* border-bottom: 1px solid var(--asm-orange); */
	border-top: 1px solid var(--sec);
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* background: var(--main); */
	z-index: 2;

	&::before {
		background-size: 42%;
	}
`;

export const Widescreen2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Widescreen2Container>
			<WholeGraphicClip>
				{/* <img src={WidescreenWhole} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}
			</WholeGraphicClip>
			<Topbar>
				<LeftBox particlesId="leftBox">
					<SmallInfo
						timer={props.timer}
						runData={props.runData}
					/>
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

				<RightBox particlesId="rightBox">
					<SponsorsBox
						style={{ flexGrow: 1, zIndex: 2 }}
						sponsors={props.sponsors}
						sponsorStyle={SponsorSize}
					/>
				</RightBox>
			</Topbar>
			<CentralDivider />
			<BottomBlock particlesId="bottomBlock">
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
