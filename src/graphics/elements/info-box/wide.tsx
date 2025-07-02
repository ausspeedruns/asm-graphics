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
	padding: 0 200px;
	box-sizing: border-box;
	gap: 50px;
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
	timerSize?: number;
	timerStyle?: CSSProperties;
	estimateSize?: number;
	maxTextWidth?: number;
	gameStackHeight?: number;
	gameTitleSize?: number;
	gameInfoSize?: number;
	bottomRowMargin?: number;
	mainStyle?: CSSProperties;
}

const DefaultWideStyling: IWideStyling = {
	timerStackHeight: 180,
	timerSize: 150,
	timerStyle: { width: 423, zIndex: 2, fontSize: 130 },
	estimateSize: 34,
	maxTextWidth: 540,
	gameStackHeight: 100,
	gameTitleSize: 37,
	gameInfoSize: 25,
	bottomRowMargin: -24,
};

interface Props {
	className?: string;
	style?: IWideStyling;
	timer?: ITimer;
	runData?: RunDataActiveRun;
}

export const WideInfo = (props: Props) => {
	const styles = { ...DefaultWideStyling, ...props.style };
	return (
		<WideInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ flexGrow: 1 }}>
				<RunInfo.GameTitle
					maxWidth={styles.maxTextWidth!}
					game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""}
					style={{ marginBottom: styles.bottomRowMargin, lineHeight: "42px" }}
				/>
				<div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
					<RunInfo.System system={props.runData?.system ?? ""} />
					<RunInfo.Year year={props.runData?.release ?? ""} />
				</div>
			</VerticalStack>
			<VerticalStack style={{ flexGrow: 1 }}>
				<RunInfo.Category
					maxWidth={styles.maxTextWidth!}
					category={props.runData?.category ?? ""}
					style={{ marginBottom: styles.bottomRowMargin }}
				/>
				<RunInfo.Estimate estimate={props.runData?.estimate ?? ""} />
			</VerticalStack>
			<Timer style={styles.timerStyle} timer={props.timer} />
		</WideInfoContainer>
	);
};
