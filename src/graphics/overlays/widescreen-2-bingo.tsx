import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";

import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";
import { BingoBoard } from "../elements/bingo-board";

import WidescreenWhole from "./backgrounds/Widescreen2p.png";

const Widescreen2BingoContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 1920 0 H 1254 V 341 H 1920 Z M 666 0 H 0 V 341 H 666 V 0 M 1920 763 H 0 V 1016 H 1920 Z");
	// background: var(--main);
	z-index: 1;
`;

const Topbar = styled.div`
	display: flex;
	height: 341px;
	width: 100%;
	overflow: hidden;
	border-bottom: 1px solid var(--sec);
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
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 2;
`;

const SponsorSize = {
	height: 230,
	width: 540,
};

const BottomBlock = styled.div`
	height: 253px;
	width: 100%;
	/* border-bottom: 1px solid var(--asm-orange); */
	// border-top: 1px solid var(--sec);
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* background: var(--main); */
	z-index: 2;
`;

const MiddleSection = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-grow: 1;
`;

const BingoBoardStyled = styled(BingoBoard)`
	width: 421px;
	height: 419px;
	z-index: 2;
`;

export const Widescreen2Bingo = (props: OverlayProps) => {
	const [bingoSyncBoardStateRep] = useReplicant("bingosync:boardState");
	const [bingoSyncBoardStateOverrideRep] = useReplicant("bingosync:boardStateOverride");
	const teamData = getTeams(props.runData, props.timer, 2);

	const unionedBoardStateCells =
		bingoSyncBoardStateRep?.cells.map((cell) => {
			const overriddenCell = bingoSyncBoardStateOverrideRep?.cells.find(
				(overrideCell) => overrideCell.slot === cell.slot,
			);
			return overriddenCell ?? cell;
		}) ?? [];

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	return (
		<Widescreen2BingoContainer>
			<WholeGraphicClip>
				<img src={WidescreenWhole} style={{ position: "absolute", height: "100%", width: "100%" }} />
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[0]}
					side="left"
					style={{ position: "absolute", top: 300, left: 624, zIndex: 2 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === allRunnerIds[1]}
					side="right"
					style={{
						position: "absolute",
						top: 300,
						right: 624,
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
					<SponsorsBox sponsors={props.sponsors} sponsorStyle={SponsorSize} />
				</RightBox>
			</Topbar>
			<MiddleSection>
				<BingoBoardStyled board={unionedBoardStateCells} />
			</MiddleSection>
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
		</Widescreen2BingoContainer>
	);
};
