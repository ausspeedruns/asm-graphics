import type { OverlayProps } from "../gameplay-overlay.js";

import { VerticalInfo } from "../elements/info-box/vertical.js";
import { SponsorsBox } from "../elements/sponsors.js";
import { Facecam } from "../elements/facecam.js";
import { Couch } from "../elements/couch/couch.js";
import { Container } from "../elements/container.js";
import { GameplayCapture } from "../elements/gameplay-capture.js";

// import StandardBG from "../media/ASM23/standard-vertical-left.png";
// import StandardRightBG from "../media/ASM23/standard-vertical-right.png";
import styles from "./standard-vertical.module.css";

export function StandardVertical(props: OverlayProps) {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<div className={styles.standardContainer}>
			<div className={styles.sidebar}>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={460}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<Container className={styles.infoBoxBg}>
					{/* <img
						src={StandardBG}
						style={{ position: "absolute", height: "auto", width: "100%", objectFit: "contain", bottom: 0 }}
					/> */}
					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						align="center"
						style={{ width: "fit-content" }}
					/>
				</Container>
			</div>
			<GameplayCapture aspectRatio="3:4" />
			<Container className={styles.rightSide}>
				<VerticalInfo timer={props.timer} runData={props.runData} />
				<SponsorsBox sponsors={props.sponsors} width={480} height={240} />
			</Container>
		</div>
	);
}
