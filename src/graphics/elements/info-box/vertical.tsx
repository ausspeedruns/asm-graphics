import styled from "@emotion/styled";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";
import { runCustomDataSchema } from "../../../shared/types/custom-data";

const VerticalInfoContainer = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	z-index: 2;
	gap: 5px;

	& #timer {
		font-size: 270%;
	}

	& #gameTitle,
	& #category {
		max-width: 90%;
	}

	& #gameTitle {
		font-size: 150%;
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
	width: 100%;
`;

const HorizontalStack = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 16px;
	width: 100%;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export function VerticalInfo(props: Props) {
	const customData = runCustomDataSchema.safeParse(props.runData?.customData ?? {}).data;

	return (
		<VerticalInfoContainer className={props.className} style={props.style}>
			<VerticalStack id="timerStack">
				<Timer milliseconds={props.timer?.milliseconds} />
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</VerticalStack>
			<VerticalStack id="gameInfo">
				<RunInfo.GameTitle game={customData?.gameDisplay ?? props.runData?.game ?? ""} />
				<HorizontalStack id="subInfoStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</HorizontalStack>
			</VerticalStack>
			<RunInfo.Category category={props.runData?.category ?? ""} />
		</VerticalInfoContainer>
	);
}
