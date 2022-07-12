import React from 'react';
import styled from 'styled-components';

import { RunDataActiveRun } from '../../../types/RunData';
import { Timer as ITimer } from '../../../types/Timer';

import { Timer } from '../timer';
import * as RunInfo from '../run-info';

import WideBG from '../../media/pixel/Wide Top.png';

const WideInfoContainer = styled.div`
	background-color: var(--main);
	background-image: url('${WideBG}');
	border-bottom: 1px var(--sec) solid;
	position: absolute;
	height: 155px;
	width: 1920px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 0 200px;
	box-sizing: border-box;
	gap: 50px;
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
	timerStyle?: React.CSSProperties;
	estimateSize?: number;
	maxTextWidth?: number;
	gameStackHeight?: number;
	gameTitleSize?: number;
	gameInfoSize?: number;
	bottomRowMargin?: number;
	mainStyle?: React.CSSProperties;
}

const DefaultWideStyling: IWideStyling = {
	timerStackHeight: 180,
	timerSize: 110,
	timerStyle: { width: 423, zIndex: 2 },
	estimateSize: 30,
	maxTextWidth: 540,
	gameStackHeight: 100,
	gameTitleSize: 37,
	gameInfoSize: 25,
	bottomRowMargin: -37,
}

interface Props {
	className?: string;
	style?: IWideStyling;
	timer: ITimer | undefined;
	runData: RunDataActiveRun | undefined;
}

export const WideInfo: React.FC<Props> = (props: Props) => {
	const styles = {...DefaultWideStyling, ...props.style};
	return (
		<WideInfoContainer className={props.className} style={styles.mainStyle}>
			<VerticalStack style={{ flexGrow: 1 }}>
				<RunInfo.GameTitle
					maxWidth={styles.maxTextWidth!}
					game={props.runData?.game || ''}
					style={{ marginBottom: styles.bottomRowMargin, marginTop: -4 }}
				/>
				<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
					<RunInfo.System system={props.runData?.system || ''} />
					<RunInfo.Year year={props.runData?.release || ''} />
				</div>
			</VerticalStack>
			<VerticalStack style={{ flexGrow: 1 }}>
				<RunInfo.Category
					maxWidth={styles.maxTextWidth!}
					category={props.runData?.category || ''}
					style={{ marginBottom: styles.bottomRowMargin }}
				/>
				<RunInfo.Estimate estimate={props.runData?.estimate || ''} />
			</VerticalStack>
			<Timer style={styles.timerStyle} timer={props.timer} />
		</WideInfoContainer>
	);
};
