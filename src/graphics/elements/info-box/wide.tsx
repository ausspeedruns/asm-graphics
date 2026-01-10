import type { CSSProperties } from "react";
import styled from "styled-components";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";
import type React from "react";

const WideInfoContainer = styled.div`
	position: absolute;
	height: 100%;
	width: 1920px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	box-sizing: border-box;
	overflow: hidden;
	z-index: 2;

	font-size: 34px;

	& #subInfoStack, & #category {
		font-weight: 600;
	}

	& #gameTitle {
		font-size: 200%;
	}

	& #timer {
		font-size: 350%;
	}
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
`;

const HorizontalStack = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
`;

const GameInfo = styled(VerticalStack)`
	min-width: 600px;
`;

const MiddleGameInfo = styled(VerticalStack)`
	min-width: 400px;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
	timer?: ITimer;
	runData?: RunDataActiveRun;
}

export function WideInfo(props: Props) {
	return (
		<WideInfoContainer className={props.className} style={props.style}>
			<GameInfo id="gameInfo">
				<RunInfo.GameTitle game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""} />
				<HorizontalStack id="subInfoStack">
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</HorizontalStack>
			</GameInfo>
			<MiddleGameInfo id="middleGameInfo">
				<RunInfo.Category category={props.runData?.category ?? ""} />
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</MiddleGameInfo>
			<VerticalStack id="timerStack">
				<Timer timer={props.timer} />
			</VerticalStack>
		</WideInfoContainer>
	);
}
