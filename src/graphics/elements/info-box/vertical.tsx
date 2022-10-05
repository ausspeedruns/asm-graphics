import React from 'react';
import styled from 'styled-components';

import { RunDataActiveRun } from '../../../types/RunData';
import { Timer as ITimer } from '../../../types/Timer';

import { Timer } from '../timer';
import * as RunInfo from '../run-info';

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

const Divider = styled.div`
	height: 1px;
	width: 80%;
	background-color: var(--sec);
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
}

const DefaultVerticalStyling: IVerticalStyling = {
	timerStackHeight: 180,
	timerSize: 110,
	timerStyle: { marginBottom: -15 },
	estimateSize: 30,
	maxTextWidth: 500,
	gameStackHeight: 100,
	gameTitleSize: 37,
	gameInfoSize: 25
}

interface Props {
	className?: string;
	style?: IVerticalStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export const VerticalInfo: React.FC<Props> = (props: Props) => {
	const styles = {...DefaultVerticalStyling, ...props.style};

	return (
		<VerticalInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ height: styles.timerStackHeight }}>
				<Timer fontSize={styles.timerSize} timer={props.timer} style={styles.timerStyle} />
				<RunInfo.Estimate fontSize={styles.estimateSize} estimate={props.runData?.estimate || ''} />
			</VerticalStack>
			<Divider />
			<RunInfo.Category maxWidth={styles.maxTextWidth!} category={props.runData?.category || ''} />
			<Divider />
			<VerticalStack style={{ height: styles.gameStackHeight, marginTop: 0, width: '100%' }}>
				<RunInfo.GameTitle maxWidth={styles.maxTextWidth!} game={props.runData?.game || ''} style={{ fontSize: styles.gameTitleSize }} />
				<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
					<RunInfo.System system={props.runData?.system || ''} style={{ fontSize: styles.gameInfoSize, zIndex: 2 }} />
					<RunInfo.Year year={props.runData?.release || ''} style={{ fontSize: styles.gameInfoSize, zIndex: 2 }} />
				</div>
			</VerticalStack>
		</VerticalInfoContainer>
	);
};
