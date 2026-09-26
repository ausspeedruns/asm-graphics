import type { OverlayProps } from "../gameplay-overlay";

import { Container } from "../elements/container";
import { SmallInfo } from "../elements/info-box/small";
import { Facecam } from "../elements/facecam";

import DSBG from "./backgrounds/DS.png";
import { GameplayCapture } from "../elements/gameplay-capture";
import styles from "./ds.module.css";

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

				<Container className={styles.infoBox}>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</Container>
				<GameplayCapture aspectRatio="4:3" />
			</div>
			<GameplayCapture aspectRatio="4:3" />
		</div>
	);
}
