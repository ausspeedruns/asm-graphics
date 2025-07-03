import React from "react";
import styled from "styled-components";

import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";

const VerticalInfoContainer = styled.div`
	height: 340px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	padding: 16px 0;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const Divider = styled.div`
	min-height: 1px;
	height: 1px;
	width: 80%;
	background-color: white;
	margin: 20px 0;
`;

export interface IVerticalStyling {
	timerStackHeight?: number;
	timerSize?: number;
	timerStyle?: React.CSSProperties;
	estimateSize?: number;
	maxTextWidth?: number;
	gameStackHeight?: number;
	gameTitleSize?: number;
	gameInfoSize?: number;
	mainStyle?: React.CSSProperties;
	categorySize?: number;
}

const DefaultVerticalStyling = {
	timerStackHeight: 180,
	timerSize: 110,
	timerStyle: { marginBottom: -5 },
	estimateSize: 30,
	maxTextWidth: 500,
	gameStackHeight: 100,
	gameTitleSize: 37,
	gameInfoSize: 25,
	categorySize: 34,
} as const satisfies IVerticalStyling;

interface Props {
	className?: string;
	style?: IVerticalStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
	hideDividers?: boolean;
}

export const VerticalTimerBottomInfo = (props: Props) => {
	const styles = { ...DefaultVerticalStyling, ...props.style };

	return (
		<VerticalInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ height: styles.gameStackHeight, marginTop: 0, width: "100%" }}>
				<RunInfo.GameTitle
					maxWidth={styles.maxTextWidth}
					game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""}
					style={{ fontSize: styles.gameTitleSize, lineHeight: `${styles.gameTitleSize}px` }}
				/>
				<div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
					<RunInfo.System
						system={props.runData?.system ?? ""}
						style={{ fontSize: styles.gameInfoSize, zIndex: 2 }}
					/>
					<RunInfo.Year
						year={props.runData?.release ?? ""}
						style={{ fontSize: styles.gameInfoSize, zIndex: 2 }}
					/>
				</div>
			</VerticalStack>
			{!props.hideDividers && <Divider />}
			<RunInfo.Category
				maxWidth={styles.maxTextWidth}
				category={props.runData?.category ?? ""}
				fontSize={styles.categorySize}
			/>
			<RunInfo.Estimate fontSize={styles.estimateSize} estimate={props.runData?.estimate ?? ""} />
			{!props.hideDividers && <Divider />}
			<VerticalStack style={{ height: styles.timerStackHeight }}>
				<Timer fontSize={styles.timerSize} timer={props.timer} style={styles.timerStyle} />
			</VerticalStack>
		</VerticalInfoContainer>
	);
};
