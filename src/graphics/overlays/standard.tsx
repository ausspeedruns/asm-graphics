import type { OverlayProps } from "../gameplay-overlay.js";

import { GameplayCapture } from "../elements/gameplay-capture.js";
import { Container } from "../elements/container.js";
import { VerticalInfo } from "../elements/info-box/vertical.js";
import { SponsorsBox } from "../elements/sponsors.js";
import { Facecam } from "../elements/facecam.js";
import { Couch } from "../elements/couch/couch.js";

import StandardBG from "./backgrounds/Standard.png";
import styles from "./standard.module.css";

// ASAP26
import swirl from "../media/asap26/Swirl.png";
import round from "../media/asap26/Round.png";

export const Standard = (props: OverlayProps) => {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<div className={styles.standardContainer}>
			<div className={styles.sidebar}>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={352}
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

					<SponsorsBox sponsors={props.sponsors} width="80%" height={150} />

					<img src={swirl} id={styles.swirlLeft} className={styles.asapGreeble} />
					<img src={swirl} id={styles.swirlRight} className={styles.asapGreeble} />
					
					<img src={swirl} id={styles.swirlBottomLeft} className={styles.asapGreeble} />
					<img src={swirl} id={styles.swirlBottomRight} className={styles.asapGreeble} />

					<img src={round} id={styles.roundLeft} className={styles.asapGreeble} />
					<img src={round} id={styles.roundRight} className={styles.asapGreeble} />
					
					<img src={round} id={styles.roundBottomLeft} className={styles.asapGreeble} />
					<img src={round} id={styles.roundBottomRight} className={styles.asapGreeble} />
				</Container>
			</div>
			<GameplayCapture aspectRatio="4:3" />
		</div>
	);
};
