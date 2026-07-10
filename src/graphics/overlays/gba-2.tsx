import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import GBA2p from "./backgrounds/GBA2p.png";
import { ASM26Felt } from "../elements/asm26/asm26-felt";

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 377px;
	width: 1920px;
	border-bottom: 1px solid white;
	overflow: hidden;
`;

const LeftBox = styled(ASM26Felt)`
	width: 666px;
	height: 100%;
	display: flex;
	position: relative;
	// background: var(--main);
`;

const RightBox = styled(ASM26Felt)`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	// background: var(--main);
	box-sizing: border-box;
`;

const SponsorSize = {
	height: 230,
	width: 400,
};

const CentralDivider = styled.div`
	height: 639px;
	width: 2px;
	position: absolute;
	top: 377px;
	left: 959px;
	background: var(--sec);
`;

const RightBoxTrim = styled.span`
	font-family: var(--game-font);
	font-size: 50px;
	z-index: 2;
	text-align: center;
	width: 100%;

	filter: drop-shadow(3px 0px 0px black);
`;

export const GBA2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);
	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<Standard2Container>
			{/* <img src={GBA2p} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}

			<Topbar>
				<LeftBox particlesId="leftBox">
					<SmallInfo timer={props.timer} runData={props.runData} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="right"
					style={{ position: "absolute", top: 295, left: 666 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="left"
					style={{
						position: "absolute",
						top: 295,
						right: 666,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 301, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place} />
				<RaceFinish style={{ top: 301, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place} />

				<RightBox particlesId="rightBox">
					<RightBoxTrim style={{ color: "var(--sec)", marginTop: 16 }}>+++++++++++++++++++</RightBoxTrim>
					<div
						style={{
							display: "flex",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							padding: "0 16px",
							boxSizing: "border-box",
						}}
					>
						<Couch
							commentators={props.commentators}
							style={{ width: "30%", zIndex: 3 }}
							audio={props.microphoneAudioIndicator}
						/>
						<SponsorsBox sponsors={props.sponsors} sponsorStyle={SponsorSize} style={{ zIndex: 5 }} />
					</div>
					<RightBoxTrim style={{ color: "var(--sec)", marginBottom: 16 }}>+++++++++++++++++++</RightBoxTrim>
				</RightBox>
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
};
