import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

import { RunDataActiveRun } from '../../types/RunData';
import { Timer as TimerType } from '../../types/Timer';
import { CurrentOverlay } from '../../types/CurrentOverlay';
import { RunnerNames } from '../../types/ExtraRunData';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { OrangeStripe } from '../elements/orange-stripe';

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoDivider = styled.div`
	height: 1px;
	width: 430px;
	background: var(--asm-orange);
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const InfoBoxBG = styled.div`
	background: var(--main-col);
`;

const InfoBox = styled.div`
	height: 400px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	height: 264px;
`;

const SponsorsSize = {
	height: 200,
	width: 430,
};

const TwitterSize = {
	height: 210,
	width: 480,
	marginTop: -60,
};

export const Standard: React.FC = () => {
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
		<StandardContainer>
			<Sidebar>
				<Facecam
					height={352}
					name={runnerNamesRep}
					hosts={currentOverlayRep?.live === 'standard' ? hostNamesRep : previewHostNamesRep}
				/>
				<InfoBoxBG>
					<InfoBox>
						<VerticalStack style={{ height: 180 }}>
							<Timer fontSize={110} timer={timerRep} style={{ marginBottom: -15 }} />
							<RunInfo.Estimate fontSize={30} estimate={runDataActiveRep?.estimate || ''} />
						</VerticalStack>
						<InfoDivider />
						<RunInfo.Category maxWidth={450} category={runDataActiveRep?.category || ''} />
						<InfoDivider />
						<VerticalStack style={{ height: 100 }}>
							<RunInfo.GameTitle
								maxWidth={540}
								game={runDataActiveRep?.game || ''}
								style={{ fontSize: 37 }}
							/>
							<RunInfo.System
								system={runDataActiveRep?.system || ''}
								style={{ fontSize: 25, zIndex: 2 }}
							/>
						</VerticalStack>
					</InfoBox>

					<SponsorBoxS sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} />
					<OrangeStripe side='bottom' style={{position: 'relative', bottom: 32, width: '100%'}} />
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
};
