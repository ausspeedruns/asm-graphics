import clsx from "clsx";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData.js";
import type { Timer as ITimer } from "@asm-graphics/types/Timer.js";

import { Timer } from "../timer.js";
import * as RunInfo from "../run-info.js";
import { runCustomDataSchema } from "../../../shared/types/custom-data.js";
import styles from "./vertical.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export function VerticalInfo(props: Props) {
	const customData = runCustomDataSchema.safeParse(props.runData?.customData ?? {}).data;

	return (
		<div className={clsx(styles.verticalInfoContainer, props.className)} style={props.style}>
			<div className={styles.verticalStack} id="timerStack">
				<Timer milliseconds={props.timer?.milliseconds} />
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</div>
			<div className={styles.verticalStack} id="gameInfo">
				<RunInfo.GameTitle game={customData?.gameDisplay ?? props.runData?.game ?? ""} />
				<div className={styles.horizontalStack} id="subInfoStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</div>
			</div>
			<RunInfo.Category category={props.runData?.category ?? ""} />
		</div>
	);
}
