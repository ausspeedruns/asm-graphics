import type { OverlayProps } from "../gameplay-overlay";

import { Container } from "../elements/container";
import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { GameplayCapture } from "../elements/gameplay-capture";
import styles from "./3ds.module.css";

// import WidescreenTop from "../elements/event-specific/dh-24/Widescreen-2.png";

export const ThreeDS = (props: OverlayProps) => {
	return (
		<div className={styles.threeDSContainer}>
			<Container className={styles.topBar}>
				{/* <img
					src={WidescreenTop}
					style={{ opacity: 0.8, position: "absolute", height: 175, width: 1295.35, right: -100 }}
				/> */}
				<div
					style={{
						position: "absolute",
						bottom: 0,
						height: 8,
						width: "100%",
						background: "var(--dh-orange-to-red)",
					}}
				/>
				<WideInfo timer={props.timer} runData={props.runData} />
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
