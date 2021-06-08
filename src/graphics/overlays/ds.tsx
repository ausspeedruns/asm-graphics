import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { RunDataActiveRun } from '../../types/RunData';
import { Timer as TimerType } from '../../types/Timer';
import { CurrentOverlay } from '../../types/CurrentOverlay';
import { RunnerNames } from '../../types/ExtraRunData';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { Facecam } from '../elements/facecam';

const DSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--sec-col);
	overflow: hidden;
`;

const DSSecondScreen = styled.div`
	width: 565px;
	height: 424px;
	border-bottom: 1px solid var(--sec-col);
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const InfoBox = styled.div`
	height: 240px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	background: linear-gradient(180deg, #df3422 0%, #7e1f15 100%);
`;

const InfoSubBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
	height: 137px;
`;

const InfoTopDivider = styled.div`
	height: 1px;
	width: 652px;
	background: var(--sec-col);
`;

const InfoSideDivider = styled.div`
	height: 100px;
	width: 1px;
	background: var(--sec-col);
`;

export const DS: React.FC = () => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [timerRep] = useReplicant<TimerType, undefined>('timer', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [hostNamesRep] = useReplicant<string[], string[]>('host-names', []);
	const [previewHostNamesRep] = useReplicant<string[], string[]>('preview-host-names', []);
	const [currentOverlayRep] = useReplicant<CurrentOverlay, undefined>('currentOverlay', undefined);
	const [runnerNamesRep] = useReplicant<RunnerNames[], RunnerNames[]>('runner-names', []);

	return (
		<DSContainer>
			<Sidebar>
				<DSSecondScreen />
				<Facecam
					height={352}
					name={runnerNamesRep}
					hosts={currentOverlayRep?.live === 'ds' ? hostNamesRep : previewHostNamesRep}
				/>
				<InfoBox>
					<VerticalStack style={{ height: 120 }}>
						<RunInfo.GameTitle
							maxWidth={540}
							game={runDataActiveRep?.game || ''}
							style={{ fontSize: 50, marginBottom: -10 }}
						/>
						<RunInfo.System system={runDataActiveRep?.system || ''} style={{ fontSize: 25, zIndex: 2 }} />
					</VerticalStack>
					<InfoTopDivider />
					<InfoSubBox>
						<VerticalStack style={{ height: 80 }}>
							<RunInfo.Category maxWidth={450} category={runDataActiveRep?.category || ''} />
							<RunInfo.Estimate fontSize={30} estimate={runDataActiveRep?.estimate || ''} />
						</VerticalStack>
						<InfoSideDivider />
						<Timer fontSize={75} timer={timerRep} />
					</InfoSubBox>
				</InfoBox>
			</Sidebar>
		</DSContainer>
	);
};
