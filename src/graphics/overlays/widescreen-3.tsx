import clsx from "clsx";

import type { OverlayProps } from "../gameplay-overlay.js";

import { AudioIndicator } from "../elements/audio-indicator.js";
import { Facecam } from "../elements/facecam.js";
import { getTeams } from "../elements/team-data.js";
// import { RaceFinish } from '../elements/race-finish.js';

import { Timer } from "../elements/timer.js";
import * as RunInfo from "../elements/run-info.js";

import GameplayBL from "../media/icons/Widescreen-3-BL.svg";
import GameplayTL from "../media/icons/Widescreen-3-TL.svg";
import GameplayTR from "../media/icons/Widescreen-3-TR.svg";
import { RaceFinish } from "../elements/race-finish.js";
import { Container } from "../elements/container.js";
import { runCustomDataSchema } from "../../shared/types/custom-data.js";
import styles from "./widescreen-3.module.css";

export const Widescreen3 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 3);

	const allRunnerIds = props.runData?.teams.flatMap((team) => team.players.map((player) => player.id)) ?? [];

	const customData = runCustomDataSchema.safeParse(props.runData?.customData);

	return (
		<div className={styles.widescreen3Container}>
			<AudioIndicator
				className={styles.wideAudioIndicator}
				active={props.gameAudioIndicator === allRunnerIds[0]}
				side="top"
				style={{ left: 961 }}
			/>
			<AudioIndicator
				className={styles.wideAudioIndicator}
				active={props.gameAudioIndicator === allRunnerIds[1]}
				side="top"
				style={{ left: 1262 }}
			/>
			<AudioIndicator
				className={styles.wideAudioIndicator}
				active={props.gameAudioIndicator === allRunnerIds[2]}
				side="top"
				style={{ left: 1563 }}
			/>
			<Container className={styles.leftBg} />
			<Container className={styles.rightBg} />
			<div className={styles.topBar}>
				<div className={styles.screen} />
				<div className={styles.screen} />
			</div>
			<div className={styles.bottomBar}>
				<div className={styles.screen} />
				<div className={styles.screen}>
					<Facecam
						width={901}
						height={326}
						dontAlternatePronouns
						pronounStartSide="right"
						teams={props.runData?.teams}
						icons={[
							<img className={styles.npIcon} src={GameplayBL} key="BL" />,
							<img className={styles.npIcon} src={GameplayTL} key="TL" />,
							<img className={styles.npIcon} src={GameplayTR} key="TR" />,
						]}
						style={{ borderRight: "1px solid var(--sec)" }}
						audioIndicator={props.microphoneAudioIndicator}
					/>

					<Container className={clsx(styles.facecamBorder, styles.facecamBorderLeft)} />
					<Container className={clsx(styles.facecamBorder, styles.facecamBorderRight)} />

					<RaceFinish
						style={{ top: 758, left: 1046, zIndex: 3 }}
						time={teamData[0]?.time}
						place={teamData[0]?.place}
					/>
					<RaceFinish
						style={{ top: 758, left: 1346, zIndex: 3 }}
						time={teamData[1]?.time}
						place={teamData[1]?.place}
					/>
					<RaceFinish
						style={{ top: 758, left: 1647, zIndex: 3 }}
						time={teamData[2]?.time}
						place={teamData[2]?.place}
					/>
					<Container className={styles.infoBox}>
						<div className={styles.infoBoxColumn} id="gameInfo">
							<RunInfo.GameTitle game={customData.data?.gameDisplay ?? props.runData?.game ?? ""} />
							<div className={styles.gameInfoBox}>
								<RunInfo.System system={props.runData?.system ?? ""} />
								<RunInfo.Year year={props.runData?.release ?? ""} />
								<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
							</div>
						</div>
						<div className={styles.infoBoxColumn} id="runInfo">
							<RunInfo.Category category={props.runData?.category ?? ""} />
							<Timer milliseconds={props.timer?.milliseconds} />
						</div>
					</Container>
				</div>
			</div>
			<div className={styles.centralDivider} />
		</div>
	);
};
