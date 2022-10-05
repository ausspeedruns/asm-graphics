import React from 'react';
import styled from 'styled-components';

import { RunDataActiveRun } from '../../../types/RunData';
import { Timer as ITimer } from '../../../types/Timer';

import { Timer } from '../timer';
import * as RunInfo from '../run-info';

const SmallInfoContainer = styled.div`
	box-sizing: border-box;
	padding: 20px 0 20px 0;
	height: 241px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	/* background-image: url('../shared/design/contour-maps/standard-2-left.svg'); */
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
	gameTitleWidth?: number;
	gameStackHeight?: number;
	gameTitleSize?: number;
	gameInfoSize?: number;
	mainStyle?: React.CSSProperties;
}

const DefaultSmallStyling: ISmallStyling = {
	timerStackHeight: 120,
	timerSize: 75,
	categoryWidth: 270,
	estimateSize: 30,
	gameTitleWidth: 540,
	gameStackHeight: 80,
	gameTitleSize: 45,
	gameInfoSize: 25
}

interface Props {
	className?: string;
	style?: ISmallStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export const SmallInfo: React.FC<Props> = (props: Props) => {
	const styles = {...DefaultSmallStyling, ...props.style};
	return (
		<SmallInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ height: styles.timerStackHeight, width: '100%' }}>
				<RunInfo.GameTitle
					maxWidth={styles.gameTitleWidth!}
					game={props.runData?.game || ''}
					style={{ fontSize: styles.gameTitleSize, marginBottom: -10 }}
				/>
				<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
					<RunInfo.System system={props.runData?.system || ''} style={{ fontSize: styles.gameInfoSize, zIndex: 2 }} />
					<RunInfo.Year year={props.runData?.release || ''} style={{ fontSize: styles.gameInfoSize, zIndex: 2 }} />
				</div>
			</VerticalStack>
			<InfoSubBox>
				<VerticalStack style={{ height: styles.gameStackHeight }}>
					<RunInfo.Category maxWidth={styles.categoryWidth!} category={props.runData?.category || ''} />
					<RunInfo.Estimate fontSize={styles.estimateSize} estimate={props.runData?.estimate || ''} />
				</VerticalStack>
				<Timer fontSize={styles.timerSize} timer={props.timer} style={styles.timerStyle} />
			</InfoSubBox>
		</SmallInfoContainer>
	);
};
