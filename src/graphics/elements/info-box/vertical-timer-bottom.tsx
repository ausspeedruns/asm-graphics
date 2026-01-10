import styled from "@emotion/styled";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";	

const VerticalInfoContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	z-index: 2;

	font-size: 28px;

	& #timer {
		font-size: 300%;
	}

	& #gameTitle, & #category {
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
	hideDividers?: boolean;
}

export function VerticalTimerBottomInfo(props: Props) {
	return (
		<VerticalInfoContainer className={props.className} style={props.style}>
			<VerticalStack id="gameInfo">
				<RunInfo.GameTitle game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""} />
				<HorizontalStack id="subInfoStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</HorizontalStack>
			</VerticalStack>
			{!props.hideDividers && <Divider className="divider" />}
			<VerticalStack id="timerStack">
				<RunInfo.Category category={props.runData?.category ?? ""} />
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</VerticalStack>
			{!props.hideDividers && <Divider className="divider" />}
			<Timer timer={props.timer} />
		</VerticalInfoContainer>
	);
}
