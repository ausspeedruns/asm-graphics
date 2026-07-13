import styled from "@emotion/styled";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";
import { customDataSchema } from "../../../shared/types/custom-data";

const SmallInfoContainer = styled.div`
	box-sizing: border-box;
	padding: 20px 10px;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	/* background: var(--main); */
	z-index: 2;

	color: var(--text-light);
	font-family: var(--main-font);

	font-size: 30px;

	& #timer {
		font-size: 200%;
	}

	& #gameTitle,
	& #category {
		max-width: 500px;
	}

	& #gameTitle {
		font-size: 200%;
		font-weight: bold;
	}
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

const TopRow = styled(VerticalStack)`
	justify-content: space-evenly;
	flex: 3;
`;

const BottomRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
	flex: 1;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export function SmallInfo(props: Props) {
	const customData = customDataSchema.safeParse(props.runData?.customData);

	return (
		<SmallInfoContainer className={props.className} style={props.style}>
			<TopRow id="topRow">
				<RunInfo.GameTitle game={customData.data?.gameDisplay ?? props.runData?.game ?? ""} />
				<RunInfo.Category category={props.runData?.category ?? ""} />
			</TopRow>
			<BottomRow id="bottomRow">
				<VerticalStack id="categoryEstimateStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</VerticalStack>
				<VerticalStack>
					<Timer milliseconds={props.timer?.milliseconds ?? 0} />
					<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
				</VerticalStack>
			</BottomRow>
		</SmallInfoContainer>
	);
}
