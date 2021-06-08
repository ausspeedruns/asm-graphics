import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { RunDataActiveRun } from '../../types/RunData';
import { Timer as TimerType } from '../../types/Timer';
import { CurrentOverlay } from '../../types/CurrentOverlay';
import { RunnerNames } from '../../types/ExtraRunData';

import { Facecam } from '../elements/facecam';
import { Timer } from '../elements/timer';
import { SponsorsBox } from '../elements/sponsors';
import * as RunInfo from '../elements/run-info';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 156px;
	height: 860px;
	width: 390px;
	border-right: 1px solid var(--main-col);
`;

const SponsorBoxS = styled(SponsorsBox)`
	position: absolute;
	width: 100%;
	height: 459px;
	left: 0px;
	top: 400px;
	background: var(--main-col);
	border-top: 1px solid var(--main-col);
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const InfoBar = styled.div`
	background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
	position: absolute;
	height: 156px;
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

const SponsorSize = {
	height: 300,
	width: 300,
};

const TwitterSize = {
	height: 320,
	width: 360,
};

export const Widescreen: React.FC = () => {
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
					<img style={{ position: 'absolute', left: 0, top: 0 }} src={'../shared/design/FullDesign.svg'} />
				</>
				<Timer style={{ width: 612, zIndex: 2 }} timer={timerRep} />
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
						style={{ marginBottom: -25, marginTop: -4, color: 'black' }}
					/>
					<RunInfo.System style={{ color: 'black' }} system={runDataActiveRep?.system || ''} />
				</VerticalStack>
			</InfoBar>
			<Sidebar>
				<Facecam
					height={400}
					name={runnerNamesRep}
					hosts={currentOverlayRep?.live === 'widescreen' ? hostNamesRep : previewHostNamesRep}
				/>

				<SponsorBoxS sponsorStyle={SponsorSize} tweetStyle={TwitterSize} />
			</Sidebar>
		</WidescreenContainer>
	);
};
