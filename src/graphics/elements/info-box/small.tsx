import clsx from "clsx";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";
import { runCustomDataSchema } from "../../../shared/types/custom-data";
import styles from "./small.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export function SmallInfo(props: Props) {
	const customData = runCustomDataSchema.safeParse(props.runData?.customData);

	return (
		<div className={clsx(styles.smallInfoContainer, props.className)} style={props.style}>
			<div className={clsx(styles.verticalStack, styles.topRow)} id="topRow">
				<RunInfo.GameTitle game={customData.data?.gameDisplay ?? props.runData?.game ?? ""} />
				<RunInfo.Category category={props.runData?.category ?? ""} />
			</div>
			<div className={styles.bottomRow} id="bottomRow">
				<div className={styles.verticalStack} id="categoryEstimateStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</div>
				<div className={styles.verticalStack}>
					<Timer milliseconds={props.timer?.milliseconds ?? 0} />
					<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
				</div>
			</div>
		</div>
	);
}
