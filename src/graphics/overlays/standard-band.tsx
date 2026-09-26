import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

// import StandardBG from "./backgrounds/Standard.png";
import styles from "./standard-band.module.css";

export function StandardBand(props: OverlayProps) {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<div className={styles.standardContainer}>
			<div className={styles.sidebar}>
				<GameplayCapture aspectRatio="4:3" />
				<Facecam
					height={41}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<Container className={styles.infoBoxBg}>
					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						showHost={props.showHost}
					/>
					<VerticalInfo timer={props.timer} runData={props.runData} />
				</Container>
			</div>
		</div>
	);
}
