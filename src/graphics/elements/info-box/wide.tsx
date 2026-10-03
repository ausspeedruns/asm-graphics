import type React from "react";
import clsx from "clsx";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData.js";
import type { Timer as ITimer } from "@asm-graphics/types/Timer.js";

import { Timer } from "../timer.js";
import * as RunInfo from "../run-info.js";

import { runCustomDataSchema } from "../../../shared/types/custom-data.js";
import styles from "./wide.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer?: ITimer;
	runData?: RunDataActiveRun;
}

export function WideInfo(props: Props) {
	const customData = runCustomDataSchema.safeParse(props.runData?.customData ?? {}).data;

	return (
		<div className={clsx(styles.wideInfoContainer, props.className)} style={props.style}>
			<div className={clsx(styles.verticalStack, styles.gameInfo)} id="gameInfo">
				<RunInfo.GameTitle game={customData?.gameDisplay ?? props.runData?.game ?? ""} />
				<div className={styles.horizontalStack} id="subInfoStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</div>
			</div>
			<div className={clsx(styles.verticalStack, styles.middleGameInfo)} id="middleGameInfo">
				<RunInfo.Category category={props.runData?.category ?? ""} />
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</div>
			<div className={styles.verticalStack} id="timerStack">
				<div className={styles.horizontalStack}>
					<Timer milliseconds={props.timer?.milliseconds ?? 0} />
				</div>
			</div>
		</div>
	);
}
