import type { OverlayProps } from "../gameplay-overlay.js";

import { SmallInfo } from "../elements/info-box/small.js";

import { SponsorsBox } from "../elements/sponsors.js";
import { AudioIndicator } from "../elements/audio-indicator.js";
import { Facecam } from "../elements/facecam.js";
import { RaceFinish } from "../elements/race-finish.js";
import { Couch } from "../elements/couch/couch.js";
import { getTeams } from "../elements/team-data.js";

import WidescreenWhole from "./backgrounds/Widescreen2p.png";
import { Container } from "../elements/container.js";
import { GameplayCapture } from "../elements/gameplay-capture.js";
import styles from "./widescreen-2.module.css";

const SponsorSize = {
	height: 230,
	width: 540,
};

export const Widescreen2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<div className={styles.widescreen2Container}>
			<div className={styles.wholeGraphicClip}>
				{/* <img src={WidescreenWhole} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}
			</div>
			<div className={styles.topbar}>
				<Container className={styles.leftBox}>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</Container>

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

				<Container className={styles.rightBox}>
					<SponsorsBox
						style={{ flexGrow: 1, zIndex: 2 }}
						sponsors={props.sponsors}
						width={SponsorSize.width}
						height={SponsorSize.height}
					/>
				</Container>
			</div>
			<div className={styles.screenContainer}>
				<GameplayCapture aspectRatio="16:9" grow />
				<div className={styles.centralDivider} />
				<GameplayCapture aspectRatio="16:9" grow />
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
