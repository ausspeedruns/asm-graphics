import type { OverlayProps } from "../gameplay-overlay.js";

import { VerticalInfo } from "../elements/info-box/vertical.js";
import { SponsorsBox } from "../elements/sponsors.js";
import { Facecam } from "../elements/facecam.js";
import { Couch } from "../elements/couch/couch.js";
import { Container } from "../elements/container.js";
import { GameplayCapture } from "../elements/gameplay-capture.js";
import styles from "./gbc.module.css";

// import GBCLeft from "../media/asap24/GBC_01.png";
// import GBCRight from "../media/asap24/GBC_02.png";

const SponsorsSize = {
	height: 130,
	width: 430,
};

export function GBC(props: OverlayProps) {
	return (
		<div className={styles.gbcContainer}>
			<div className={styles.sidebar}>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />
				<Container className={styles.infoBoxBg}>
					{/* <img src={GBCLeft} style={{ position: "absolute" }} /> */}
					<Couch commentators={props.commentators} audio={props.microphoneAudioIndicator} darkTitle />
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<SponsorsBox className={styles.sponsorBoxStyle} sponsors={props.sponsors} width="90%" height={200} />
				</Container>
			</div>
			<GameplayCapture aspectRatio="10:9" />
			<Container className={styles.rightSidebar}>{/* <img src={GBCRight} style={{ position: "absolute" }} /> */}</Container>
		</div>
	);
}
