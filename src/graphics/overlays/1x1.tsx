import { GameplayCapture } from "../elements/gameplay-capture";
import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch/couch";
import { Container } from "../elements/container";
import styles from "./1x1.module.css";

// import Background from "./backgrounds/1x1.png";

export function OneByOne(props: OverlayProps) {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<div className={styles.standardContainer}>
			<div className={styles.fullGraphicClip}>
				{/* <img src={Background} style={{ position: "absolute", width: "100%", height: "100%" }} /> */}
			</div>
			<div className={styles.sidebar}>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<Container className={styles.infoBox}>
					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						showHost={props.showHost}
					/>

					<VerticalInfo timer={props.timer} runData={props.runData} />

					<SponsorsBox sponsors={props.sponsors} width={480} height={125} />
				</Container>
			</div>
			<GameplayCapture aspectRatio="1:1" />
			<Container className={styles.rightBox} />
		</div>
	);
}
