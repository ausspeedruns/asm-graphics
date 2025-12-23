import styled from "styled-components";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer as ITimer } from "@asm-graphics/types/Timer";

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
	z-index: 2;
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
	padding: 0 16px;
	box-sizing: border-box;
`;

export interface ISmallStyling {
	timerStackHeight?: number;
	timerFontSize?: number;
	timerStyle?: React.CSSProperties;
	categoryWidth?: number;
	estimateFontSize?: number;
	lowerStackHeight?: number;
	gameTitleWidth?: number;
	gameStackHeight?: number;
	gameTitleFontSize?: number;
	gameInfoFontSize?: number;
	mainStyle?: React.CSSProperties;
	lowerStackStyle?: React.CSSProperties;
	gameNameStyle?: React.CSSProperties;
	categoryStyle?: React.CSSProperties;
	estimateStyle?: React.CSSProperties;
}

const DefaultSmallStyling = {
	timerStackHeight: 120,
	timerFontSize: 75,
	categoryWidth: 270,
	estimateFontSize: 30,
	gameTitleWidth: 540,
	gameStackHeight: 80,
	gameTitleFontSize: 45,
	gameInfoFontSize: 25,
} as const satisfies ISmallStyling;

interface Props {
	className?: string;
	style?: ISmallStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export function SmallInfo(props: Props) {
	const styles = { ...DefaultSmallStyling, ...props.style };
	return (
		<SmallInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ height: styles.timerStackHeight, width: "100%" }}>
				<RunInfo.GameTitle
					maxWidth={styles.gameTitleWidth}
					game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""}
					style={{
						fontSize: styles.gameTitleFontSize,
						width: "80%",
						padding: "10px",
						...styles.gameNameStyle,
					}}
				/>
				<RunInfo.Category
					maxWidth={styles.categoryWidth}
					category={props.runData?.category ?? ""}
					style={{ fontSize: 30, ...styles.categoryStyle }}
				/>
			</VerticalStack>
			<InfoSubBox style={{ ...styles.lowerStackStyle, height: styles.lowerStackHeight }}>
				<div
					style={{
						flexGrow: 1,
						display: "flex",
						flexDirection: "column",
						alignContent: "center",
						justifyContent: "space-evenly",
					}}
				>
					<RunInfo.System
						system={props.runData?.system ?? ""}
						style={{
							fontSize: styles.gameInfoFontSize,
							zIndex: 2,
							WebkitTextStrokeWidth: 2,
							transform: "rotate(-5deg)",
						}}
					/>
					<RunInfo.Year
						year={props.runData?.release ?? ""}
						style={{ fontSize: styles.gameInfoFontSize, textAlign: "right", marginRight: 16, zIndex: 2 }}
					/>
				</div>
				<VerticalStack style={{ height: styles.gameStackHeight, width: 400 }}>
					<Timer
						fontSize={styles.timerFontSize}
						timer={props.timer}
						style={{ padding: "16px 8px", width: "90%", ...styles.timerStyle }}
					/>
					<RunInfo.Estimate
						fontSize={styles.estimateFontSize}
						estimate={props.runData?.estimate ?? ""}
						style={styles.estimateStyle}
					/>
				</VerticalStack>
			</InfoSubBox>
		</SmallInfoContainer>
	);
}
