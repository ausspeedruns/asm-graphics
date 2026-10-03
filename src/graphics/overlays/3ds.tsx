import type { OverlayProps } from "../gameplay-overlay.js";

import { Container } from "../elements/container.js";
import { WideInfo } from "../elements/info-box/wide.js";
import { Facecam } from "../elements/facecam.js";
import { GameplayCapture } from "../elements/gameplay-capture.js";
import styles from "./3ds.module.css";

// import WidescreenTop from "../elements/event-specific/dh-24/Widescreen-2.png";
import side from "../media/asap26/Side.png";

export const ThreeDS = (props: OverlayProps) => {
	return (
		<div className={styles.threeDSContainer}>
			<Container className={styles.topBar}>
				{/* <img
					src={WidescreenTop}
					style={{ opacity: 0.8, position: "absolute", height: 175, width: 1295.35, right: -100 }}
				/> */}
				<WideInfo timer={props.timer} runData={props.runData} />
				<img src={side} id={styles.sideLeft} className={styles.asapGreeble} />
				<img src={side} id={styles.sideRight} className={styles.asapGreeble} />
			</Container>
			<div className={styles.gameRow}>
				<div className={styles.sidebar}>
					<Facecam
						// style={{ borderBottom: '1px solid #FFC629' }}
						maxNameWidth={270}
						height={451}
						teams={props.runData?.teams}
						pronounStartSide="right"
						audioIndicator={props.microphoneAudioIndicator}
					/>
					<GameplayCapture aspectRatio="4:3" />
				</div>
				<GameplayCapture aspectRatio="5:3" />
			</div>
		</div>
	);
};
