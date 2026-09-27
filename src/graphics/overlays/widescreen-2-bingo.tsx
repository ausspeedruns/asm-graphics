import { useReplicant } from "@nodecg/react-hooks";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";

import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch/couch";
import { getTeams } from "../elements/team-data";
import { BingoBoard } from "../elements/bingo-board";

// import WidescreenWhole from "./backgrounds/Widescreen2p.png";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";
import styles from "./widescreen-2-bingo.module.css";

const SponsorSize = {
	height: 230,
	width: 540,
};

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
		<div className={styles.widescreen2BingoContainer}>
			{/* <WholeGraphicClip>
				<img src={WidescreenWhole} style={{ position: "absolute", height: "100%", width: "100%" }} />
			</WholeGraphicClip> */}
			<div className={styles.topbar}>
				<Container className={styles.leftBox}>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</Container>

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

				<Container className={styles.rightBox}>
					<SponsorsBox sponsors={props.sponsors} width={SponsorSize.width} height={SponsorSize.height} />
				</Container>
			</div>
			<div className={styles.gameRow}>
				<GameplayCapture aspectRatio="16:9" />
				<BingoBoard className={styles.bingoBoard} board={unionedBoardStateCells} />
				<GameplayCapture aspectRatio="16:9" />
			</div>
			<Container className={styles.bottomBlock}>
				<Couch
					commentators={props.commentators}
					audio={props.microphoneAudioIndicator}
					showHost={props.showHost}
				/>
			</Container>

			{/* <svg id="widescreen2Clip">
				<defs>
					<clipPath>
						<polygon points="667,0 1253,0, 1253,341 667,341" />
					</clipPath>
				</defs>
			</svg> */}
		</div>
	);
};
