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
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

interface DividerProps {
	margin: number;
}

const Divider = styled.div<DividerProps>`
	min-height: 1px;
	height: 1px;
	width: 80%;
	background-color: white;
	margin: ${({ margin }) => `${margin}px 0`};
`;

export interface IVerticalStyling {
	timerStackHeight?: number;
	timerFontSize?: number;
	timerStyle?: React.CSSProperties;
	estimateFontSize?: number;
	maxTextWidth?: number;
	gameStackHeight?: number;
	gameTitleFontSize?: number;
	gameInfoFontSize?: number;
	mainStyle?: React.CSSProperties;
	categoryFontSize?: number;
	dividerMargin?: number;
	gameTitleStyle?: React.CSSProperties;
	estimateStyle?: React.CSSProperties;
}

const DefaultVerticalStyling = {
	timerStackHeight: 180,
	timerFontSize: 110,
	timerStyle: { marginBottom: -5 },
	estimateFontSize: 30,
	maxTextWidth: 500,
	gameStackHeight: 100,
	gameTitleFontSize: 37,
	gameInfoFontSize: 25,
	categoryFontSize: 34,
	dividerMargin: 20,
} as const satisfies IVerticalStyling;

interface Props {
	className?: string;
	style?: IVerticalStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
	hideDividers?: boolean;
}

export function VerticalInfo(props: Props) {
	const styles = { ...DefaultVerticalStyling, ...props.style };

	return (
		<VerticalInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ height: styles.timerStackHeight }}>
				<Timer fontSize={styles.timerFontSize} timer={props.timer} style={styles.timerStyle} />
				<RunInfo.Estimate
					fontSize={styles.estimateFontSize}
					estimate={props.runData?.estimate ?? ""}
					style={styles.estimateStyle}
				/>
			</VerticalStack>
			{!props.hideDividers && <Divider margin={styles.dividerMargin} />}
			<VerticalStack style={{ height: styles.gameStackHeight, marginTop: 0, width: "100%" }}>
				<RunInfo.GameTitle
					maxWidth={styles.maxTextWidth}
					game={props.runData?.customData.gameDisplay ?? props.runData?.game ?? ""}
					style={{
						fontSize: styles.gameTitleFontSize,
						lineHeight: `${styles.gameTitleFontSize}px`,
						...styles.gameTitleStyle,
					}}
				/>
				<div style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
					<RunInfo.System
						system={props.runData?.system ?? ""}
						style={{ fontSize: styles.gameInfoFontSize, zIndex: 2 }}
					/>
					<RunInfo.Year
						year={props.runData?.release ?? ""}
						style={{ fontSize: styles.gameInfoFontSize, zIndex: 2 }}
					/>
				</div>
			</VerticalStack>
			{!props.hideDividers && <Divider margin={styles.dividerMargin} />}
			<RunInfo.Category
				maxWidth={styles.maxTextWidth!}
				category={props.runData?.category ?? ""}
				fontSize={styles.categoryFontSize}
			/>
		</VerticalInfoContainer>
	);
}
