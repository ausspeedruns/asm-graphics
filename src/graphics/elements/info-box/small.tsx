import React from "react";
import styled from "styled-components";

import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";

const SmallInfoContainer = styled.div`
	box-sizing: border-box;
	padding: 20px 0 20px 0;
	height: 241px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	/* background: var(--main); */
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const InfoSubBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
	height: 137px;
`;

export interface ISmallStyling {
	timerStackHeight?: number;
	timerSize?: number;
	timerStyle?: React.CSSProperties;
	categoryWidth?: number;
	estimateSize?: number;
	lowerStackHeight?: number;
	gameTitleWidth?: number;
	gameStackHeight?: number;
	gameTitleSize?: number;
	gameInfoSize?: number;
	mainStyle?: React.CSSProperties;
	lowerStackStyle?: React.CSSProperties;
	gameNameStyle?: React.CSSProperties;
	categoryStyle?: React.CSSProperties;
	gameNameBottomMargin?: number;
}

const DefaultSmallStyling: ISmallStyling = {
	timerStackHeight: 120,
	timerSize: 75,
	categoryWidth: 270,
	estimateSize: 30,
	gameTitleWidth: 540,
	gameStackHeight: 80,
	gameTitleSize: 45,
	gameInfoSize: 25,
	gameNameBottomMargin: -10,
};

interface Props {
	className?: string;
	style?: ISmallStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export const SmallInfo: React.FC<Props> = (props: Props) => {
	const styles = { ...DefaultSmallStyling, ...props.style };
	return (
		<SmallInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ height: styles.timerStackHeight, width: "100%" }}>
				<RunInfo.GameTitle
					maxWidth={styles.gameTitleWidth!}
					game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""}
					style={{
						fontSize: styles.gameTitleSize,
						marginBottom: styles.gameNameBottomMargin,
						...styles.gameNameStyle,
					}}
				/>
				<div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
					<RunInfo.System
						system={props.runData?.system || ""}
						style={{ fontSize: styles.gameInfoSize, zIndex: 2 }}
					/>
					<RunInfo.Year
						year={props.runData?.release || ""}
						style={{ fontSize: styles.gameInfoSize, zIndex: 2 }}
					/>
				</div>
			</VerticalStack>
			<InfoSubBox style={{ ...styles.lowerStackStyle, height: styles.lowerStackHeight }}>
				<VerticalStack style={{ height: styles.gameStackHeight, ...styles.categoryStyle }}>
					<RunInfo.Category maxWidth={styles.categoryWidth!} category={props.runData?.category || ""} />
					<RunInfo.Estimate fontSize={styles.estimateSize} estimate={props.runData?.estimate || ""} />
				</VerticalStack>
				<Timer fontSize={styles.timerSize} timer={props.timer} style={styles.timerStyle} />
			</InfoSubBox>
		</SmallInfoContainer>
	);
};
