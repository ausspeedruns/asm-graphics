import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch";
import { AudioIndicator } from "../elements/audio-indicator";
import { RaceFinish } from "../elements/race-finish";
import { getTeams } from "../elements/team-data";
import { ASM26Bricks } from "../elements/asm26/asm26-bricks";
import { Nameplate } from "../elements/nameplate";

import AdWreath from "../media/asm26/ad-wreath.png";

const Widescreen4Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
	position: relative;
`;

const Middle = styled.div`
	position: relative;
	height: 1016px;
	width: 400px;
	border-right: 1px solid var(--sec);
	border-left: 1px solid var(--sec);
	overflow: hidden;
`;

const InfoBox = styled.div`
	// background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 664px;
	padding: 16px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	/* height: 264px; */
`;

const ASM26WreathContainer = styled.div`
	position: relative;
	background: #369cdb;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
	padding: 30px 60px;
	z-index: 20;
`;

const ASM26Wreath = styled.img`
	position: absolute;
	top: -50px;
	left: -50px;
	width: calc(100% + 100px);
	height: calc(100% + 100px);
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const SponsorsSize = {
	height: 70,
	width: 200,
};

export function Widescreen4(props: OverlayProps) {
	const teamData = getTeams(props.runData, props.timer, 2);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<Widescreen4Container>
			<ASM26Bricks
				style={
					{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						zIndex: 1,
						clipPath:
							"path('M 1920 472 V 428 H 1161 V 278 H 760 V 428 H 0 V 472 H 760 V 901 H 0 V 1016 H 1920 V 901 H 1161 V 472 H 1920 Z')",
						"--bricks-size": "30%",
					} as React.CSSProperties
				}
				particlesId="widescreen4"
			/>
			{props.runData?.teams[0]?.players[0] && (
				<Nameplate
					player={props.runData.teams[0].players[0]}
					speaking={
						props.microphoneAudioIndicator?.[
							props.runData.teams[0].players[0].customData["microphone"] ?? ""
						]
					}
					style={{ zIndex: 4, height: 40, width: 760, position: "absolute", top: 428, left: 0 }}
				/>
			)}
			{props.runData?.teams[1]?.players[0] && (
				<Nameplate
					player={props.runData.teams[1].players[0]}
					speaking={
						props.microphoneAudioIndicator?.[
							props.runData.teams[1].players[0].customData["microphone"] ?? ""
						]
					}	
					style={{ zIndex: 4, height: 40, width: 760, position: "absolute", top: 901, left: 0 }}
				/>
			)}
			{props.runData?.teams[2]?.players[0] && (
				<Nameplate
					player={props.runData.teams[2].players[0]}
					speaking={
						props.microphoneAudioIndicator?.[
							props.runData.teams[2].players[0].customData["microphone"] ?? ""
						]
					}
					style={{ zIndex: 4, height: 40, width: 760, position: "absolute", top: 428, right: 0 }}
				/>
			)}
			{props.runData?.teams[3]?.players[0] && (
				<Nameplate
					player={props.runData.teams[3].players[0]}
					speaking={
						props.microphoneAudioIndicator?.[
							props.runData.teams[3].players[0].customData["microphone"] ?? ""
						]
					}
					style={{ zIndex: 4, height: 40, width: 760, position: "absolute", top: 901, right: 0 }}
				/>
			)}
			<Middle>
				{/* <Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} /> */}
				<div style={{ height: 278 }} />

				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[2]?.time} place={teamData[2]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[3]?.time} place={teamData[3]?.place ?? -1} />

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="top"
					style={{ position: "absolute", top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="top"
					style={{
						position: "absolute",
						top: 270,
						right: 678,
						zIndex: 2,
					}}
				/>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[2]}
					side="top"
					style={{ position: "absolute", top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[3]}
					side="top"
					style={{
						position: "absolute",
						top: 270,
						right: 678,
						zIndex: 2,
					}}
				/>
				<InfoBox>
					<Couch commentators={props.commentators} style={{ zIndex: 2 }} />
					<VerticalInfo timer={props.timer} runData={props.runData} />

					<ASM26WreathContainer>
						<ASM26Wreath src={AdWreath} />
						<SponsorBoxS sponsors={props.sponsors} sponsorStyle={SponsorsSize} />
					</ASM26WreathContainer>
				</InfoBox>
			</Middle>
		</Widescreen4Container>
	);
}
