import type { OverlayProps } from "../gameplay-overlay";

import { Container } from "../elements/container";
import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch";

import WidescreenTop from "./backgrounds/WidescreenTop.png";
import WidescreenBottom from "./backgrounds/WidescreenBottom.png";
import { GameplayCapture } from "../elements/gameplay-capture";
import styles from "./widescreen.module.css";

export const Widescreen = (props: OverlayProps) => {
	const nameplateMaxWidth = 200 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<div className={styles.widescreenContainer}>
			{/* <div
				style={{
					position: "absolute",
					zIndex: 1,
					width: "100%",
					height: "100%",
					clipPath: "path('M 0 0 H 1920 V 207 H 0 Z M 0 556 H 479 V 1017 H 0 Z')",
				}}
			/> */}
			<Container className={styles.topBar}>
				<WideInfo timer={props.timer} runData={props.runData} />
			</Container>
			<div className={styles.gameplayRow}>
				<div className={styles.sidebar}>
					<Facecam
						maxNameWidth={nameplateMaxWidth}
						height={400}
						teams={props.runData?.teams}
						pronounStartSide="right"
						audioIndicator={props.microphoneAudioIndicator}
						verticalCoop
					/>
					<Container className={styles.sidebarBg}>
						<Couch
							style={{ zIndex: 2 }}
							commentators={props.commentators}
							audio={props.microphoneAudioIndicator}
							darkTitle
						/>

						{props.onScreenWarning?.show && (
							<div
								style={{
									background: "#f00",
									fontWeight: "bold",
									zIndex: 2,
									width: "80%",
									color: "white",
									padding: "0.5rem",
									textAlign: "center",
									textWrap: "balance",
									fontSize: "1.3rem",
								}}
							>
								{props.onScreenWarning?.message}
							</div>
						)}

						<SponsorsBox sponsors={props.sponsors} width="90%" height={200} />
					</Container>
				</div>
				<GameplayCapture aspectRatio="16:9" grow />
			</div>
		</div>
	);
};
