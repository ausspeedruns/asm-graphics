import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { RunDataActiveRun } from '../../types/RunData';
import { Timer as TimerType } from '../../types/Timer';
import { CurrentOverlay } from '../../types/CurrentOverlay';
import { RunnerNames } from '../../types/ExtraRunData';

import { Timer } from '../elements/timer';
import { SponsorsBox } from '../elements/sponsors';
import * as RunInfo from '../elements/run-info';
import { Facecam } from '../elements/facecam';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 144px;
	height: 872px;
	width: 523px;
	border-right: 1px solid var(--sec-col);

	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	overflow: hidden;
`;

const SponsorsBoxS = styled(SponsorsBox)`
	width: 100%;
	background: linear-gradient(180deg, #df3422 0%, #7e1f15 100%);
	flex-grow: 1;
`;

const InfoBar = styled.div`
	background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
	position: absolute;
	height: 144px;
	width: 1920px;
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const SponsorsStyled = {
	height: 250,
	width: 400
};

export const Widescreen1610: React.FC = () => {
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
		<WidescreenContainer>
			<InfoBar>
				{/* Fancy design stuff */}
				<>
					<img style={{ position: 'absolute', left: 0, transform: 'scaleY(0.92)' }} src={'../shared/design/FullDesign.svg'} />
				</>
				<Timer style={{ width: 587, zIndex: 2 }} timer={timerRep} />
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.Category
						maxWidth={420}
						category={runDataActiveRep?.category || ''}
						style={{ marginBottom: -25, color: 'black' }}
					/>
					<RunInfo.Estimate style={{ color: 'black' }} estimate={runDataActiveRep?.estimate || ''} />
				</VerticalStack>
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.GameTitle
						maxWidth={680}
						game={runDataActiveRep?.game || ''}
						style={{ marginBottom: -15, color: 'black' }}
					/>
					<RunInfo.System style={{ color: 'black' }} system={runDataActiveRep?.system || ''} />
				</VerticalStack>
			</InfoBar>

			<Sidebar>
				<Facecam
					height={400}
					name={runnerNamesRep}
					hosts={currentOverlayRep?.live === 'widescreen16-10' ? hostNamesRep : previewHostNamesRep}
				/>
				<SponsorsBoxS sponsorStyle={SponsorsStyled} tweetStyle={SponsorsStyled} />
			</Sidebar>
		</WidescreenContainer>
	);
};
