import { WideInfo } from "../elements/info-box/wide";
import type { OverlayProps } from "../gameplay-overlay";
import { Facecam } from "../elements/facecam";
import { Container } from "../elements/container";
import styles from "./top-bar-only.module.css";

export function TopBarOnly(props: OverlayProps) {
	return (
		<div className={styles.topBarOnlyContainer}>
			<Container className={styles.topBar}>
				<WideInfo timer={props.timer} runData={props.runData} />
			</Container>
			<Facecam
				height={41}
				teams={props.runData?.teams}
				pronounStartSide="right"
				audioIndicator={props.microphoneAudioIndicator}
				verticalCoop
			/>
		</div>
	);
}
