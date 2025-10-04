import type { CSSProperties } from "react";
import styled from "styled-components";

import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { Timer as ITimer } from "@asm-graphics/types/Timer";

import { Timer } from "../timer";
import * as RunInfo from "../run-info";

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
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

export interface IWideStyling {
	timerStackHeight?: number;
	timerFontSize?: number;
	timerStyle?: CSSProperties;
	estimateFontSize?: number;
	maxTextWidth?: number;
	gameStackHeight?: number;
	gameTitleFontSize?: number;
	gameInfoFontSize?: number;
	mainStyle?: CSSProperties;
}

const DefaultWideStyling = {
	timerStackHeight: 180,
	timerFontSize: 100,
	timerStyle: { zIndex: 2 },
	estimateFontSize: 64,
	maxTextWidth: 540,
	gameStackHeight: 100,
	gameTitleFontSize: 30,
	gameInfoFontSize: 64,
} as const satisfies IWideStyling;

interface Props {
	className?: string;
	style?: IWideStyling;
	timer?: ITimer;
	runData?: RunDataActiveRun;
}

export function WideInfo(props: Props) {
	const styles = { ...DefaultWideStyling, ...props.style };
	return (
		<WideInfoContainer className={props.className} style={styles.mainStyle}>
			<RunInfo.GameTitle
				maxWidth={styles.maxTextWidth}
				game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""}
				style={{ fontSize: styles.gameTitleFontSize, padding: "20px 40px" }}
			/>
			<VerticalStack style={{ width: 400, justifyContent: "center", gap: 8 }}>
				<RunInfo.Category maxWidth={styles.maxTextWidth} category={props.runData?.category ?? ""} />
				<div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
					<RunInfo.System
						system={props.runData?.system ?? ""}
						style={{ fontSize: styles.gameInfoFontSize, WebkitTextStrokeWidth: 2, transform: "rotate(-5deg)" }}
					/>
					<RunInfo.Year year={props.runData?.release ?? ""} style={{ fontSize: styles.gameInfoFontSize }} />
				</div>
			</VerticalStack>
			<VerticalStack>
				<Timer style={{ padding: "16px 32px", ...styles.timerStyle }} timer={props.timer} />
				<RunInfo.Estimate
					estimate={props.runData?.estimate ?? ""}
					fontSize={styles.estimateFontSize}
					style={{ height: 0, marginTop: -14, lineHeight: 0 }}
				/>
			</VerticalStack>
		</WideInfoContainer>
	);
}
