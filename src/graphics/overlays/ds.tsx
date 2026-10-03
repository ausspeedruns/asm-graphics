import type { OverlayProps } from "../gameplay-overlay.js";

import { Container } from "../elements/container.js";
import { SmallInfo } from "../elements/info-box/small.js";
import { Facecam } from "../elements/facecam.js";

import DSBG from "./backgrounds/DS.png";
import { GameplayCapture } from "../elements/gameplay-capture.js";
import styles from "./ds.module.css";

import round from "../media/asap26/Round.png";
import swirl from "../media/asap26/Swirl.png";

export function DS(props: OverlayProps) {
	return (
		<div className={styles.dsContainer}>
			<div className={styles.sidebar}>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<Container className={styles.infoBox} asap26NoBorder>
					<SmallInfo timer={props.timer} runData={props.runData} />

					<img src={swirl} id={styles.swirlLeft} className={styles.asapGreeble} />
					<img src={swirl} id={styles.swirlRight} className={styles.asapGreeble} />

					<img src={round} id={styles.roundLeft} className={styles.asapGreeble} />
					<img src={round} id={styles.roundRight} className={styles.asapGreeble} />

				</Container>
				<GameplayCapture aspectRatio="4:3" />
			</div>
			<GameplayCapture aspectRatio="4:3" />
		</div>
	);
}
