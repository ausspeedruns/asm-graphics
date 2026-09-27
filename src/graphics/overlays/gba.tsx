import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch/couch";

import GBABG from "./backgrounds/GBA.png";

import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";
import styles from "./gba.module.css";

const SponsorsStyled = {
	width: 340,
};

export const GBA = (props: OverlayProps) => {
	return (
		<div className={styles.gbaContainer}>
			<div className={styles.sidebar}>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
				/>
				<Container className={styles.infoBoxBg}>
					{/* <img src={GBABG} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}
					<Couch commentators={props.commentators} audio={props.microphoneAudioIndicator} />
					<VerticalInfo
						timer={props.timer}
						runData={props.runData}
					/>

					<SponsorsBox
						className={styles.sponsorsBox}
						sponsors={props.sponsors}
						width={SponsorsStyled.width}
						height={200}
					/>
				</Container>
			</div>
			<GameplayCapture aspectRatio="3:2" />
		</div>
	);
};
