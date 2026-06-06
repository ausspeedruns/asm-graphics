import styled from "@emotion/styled";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";

import { Timer } from "../../../../elements/timer";
import * as RunInfo from "../../../../elements/run-info";
import { useOverlayStore } from "../../../../stores/overlay-store";

const VerticalInfoContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	z-index: 2;
	gap: 10px;

	font-size: 28px;

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
	hideDividers?: boolean;
}

export function VerticalInfo(props: Props) {
	const timerMilliseconds = useOverlayStore((state) => state.timer?.milliseconds);
	const customGameName = useOverlayStore((state) => state.runData?.customData["gameDisplay"]);
	const gameName = useOverlayStore((state) => state.runData?.game);
	const estimate = useOverlayStore((state) => state.runData?.estimate);
	const system = useOverlayStore((state) => state.runData?.system);
	const releaseYear = useOverlayStore((state) => state.runData?.release);
	const category = useOverlayStore((state) => state.runData?.category);

	return (
		<VerticalInfoContainer className={props.className} style={props.style}>
			<VerticalStack id="timerStack">
				<Timer milliseconds={timerMilliseconds} />
				<RunInfo.Estimate estimate={estimate ?? ""} />
			</VerticalStack>
			{!props.hideDividers && <Divider className="divider" />}
			<VerticalStack id="gameInfo">
				<RunInfo.GameTitle game={customGameName ?? gameName ?? ""} />
				<HorizontalStack id="subInfoStack">
					<RunInfo.System system={system ?? ""} />
					<RunInfo.Year year={releaseYear ?? ""} />
				</HorizontalStack>
			</VerticalStack>
			{!props.hideDividers && <Divider className="divider" />}
			<RunInfo.Category category={category ?? ""} />
		</VerticalInfoContainer>
	);
}
