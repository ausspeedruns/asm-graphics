import styled from "@emotion/styled";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";
import { runCustomDataSchema } from "../../../shared/types/custom-data";

const VerticalInfoContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	z-index: 2;
	gap: 5px;

	& #timer {
		font-size: 300%;
	}

	& #gameTitle,
	& #category {
		max-width: 90%;
	}

	& #gameTitle {
		font-size: 180%;
	}

	& #category {
		font-weight: 600;
	}
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
	width: 100%;
`;

const HorizontalStack = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
`;

const Divider = styled.div`
	min-height: 1px;
	height: 1px;
	width: 80%;
	background-color: white;
	margin: 20px 0;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export function VerticalTimerBottomInfo(props: Props) {
	const customData = runCustomDataSchema.safeParse(props.runData?.customData ?? {}).data;

	return (
		<VerticalInfoContainer className={props.className} style={props.style}>
			<VerticalStack id="gameInfo">
				<RunInfo.GameTitle game={customData?.gameDisplay ?? props.runData?.game ?? ""} />
				<HorizontalStack id="subInfoStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</HorizontalStack>
			</VerticalStack>
			<VerticalStack id="timerStack">
				<RunInfo.Category category={props.runData?.category ?? ""} />
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</VerticalStack>
			<Timer milliseconds={props.timer?.milliseconds ?? 0} />
		</VerticalInfoContainer>
	);
}
