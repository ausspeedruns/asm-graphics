import styles from "./host.module.css";
import { useIntermissionStore } from "../stores/intermission-store";
import { FitText } from "../elements/fit-text";

import Mic from "../overlays/asm26/Host.svg?react";

export function IntermissionHost() {
	const host = useIntermissionStore((state) => state.host);

	if (!host) return null;

	return (
		<div className={styles.host}>
			<Mic className={styles.icon} />
			<div className={styles.name}>
				<FitText text={host?.name} alignment="left" />
				{host?.pronouns && <div className={styles.pronouns}>{host.pronouns}</div>}
			</div>
		</div>
	);
}
