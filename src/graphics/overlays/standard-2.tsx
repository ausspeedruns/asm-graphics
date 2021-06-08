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
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 296px;
	width: 1920px;
	border-bottom: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoTopDivider = styled.div`
	height: 1px;
	width: 652px;
	background: var(--asm-orange);
`;

const InfoSideDivider = styled.div`
	height: 140px;
	width: 1px;
	background: var(--asm-orange);
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
`;

const InfoBox = styled.div`
	height: 100%;
	width: 666px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	background: var(--main-col);
`;

const InfoSubBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	width: 100%;
`;

const SponsorsBoxS = styled(SponsorsBox)`
	width: 666px;
	height: 100%;
	background: var(--main-col);
`;

const SponsorSize = {
	height: 195,
	width: 340,
};

const TwitterSize = {
	height: 200,
	width: 540,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 719px;
	width: 2px;
	position: absolute;
	top: 297px;
	left: 959px;
	background: var(--asm-orange);
`;

export const Standard2: React.FC = () => {
	const [runDataActiveRep] = useReplicant<RunDataActiveRun, undefined>('runDataActiveRun', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [timerRep] = useReplicant<TimerType, undefined>('timer', undefined, {
		namespace: 'nodecg-speedcontrol',
	});
	const [audioIndicatorRep] = useReplicant<string, string>('audio-indicator', '');
	const [hostNamesRep] = useReplicant<string[], string[]>('host-names', []);
	const [previewHostNamesRep] = useReplicant<string[], string[]>('preview-host-names', []);
	const [currentOverlayRep] = useReplicant<CurrentOverlay, undefined>('currentOverlay', undefined);
	const [runnerNamesRep] = useReplicant<RunnerNames[], RunnerNames[]>('runner-names', []);

	let raceTimers = <></>;
	if (timerRep && runDataActiveRep) {
		raceTimers = (
			<>
				<RaceFinish style={{ top: 220, left: 830 }} time={timerRep} teamID={runnerNamesRep[0]?.id || ''} />
				<RaceFinish style={{ top: 220, left: 960 }} time={timerRep} teamID={runnerNamesRep[1]?.id || ''} />
			</>
		);
	}

	return (
		<Standard2Container>
			<Topbar>
				<InfoBox>
					<VerticalStack style={{ height: 100 }}>
						<RunInfo.GameTitle
							maxWidth={540}
							game={runDataActiveRep?.game || ''}
							style={{ fontSize: 37 }}
						/>
						<RunInfo.System system={runDataActiveRep?.system || ''} style={{ fontSize: 25, zIndex: 2 }} />
					</VerticalStack>
					<InfoTopDivider />
					<InfoSubBox>
						<VerticalStack style={{ height: 120 }}>
							<RunInfo.Category maxWidth={370} category={runDataActiveRep?.category || ''} />
							<RunInfo.Estimate fontSize={30} estimate={runDataActiveRep?.estimate || ''} />
						</VerticalStack>
						<InfoSideDivider />
						<Timer fontSize={75} timer={timerRep} />
					</InfoSubBox>
				</InfoBox>

				<AudioIndicator
					active={audioIndicatorRep === (runnerNamesRep[0]?.id || '')}
					side="left"
					style={{ position: 'absolute', top: 255, left: 625 }}
				/>
				<AudioIndicator
					active={audioIndicatorRep === (runnerNamesRep[1]?.id || '')}
					side="right"
					style={{ position: 'absolute', top: 255, right: 625, zIndex: 2 }}
				/>

				<Facecam
					width={586}
					name={runnerNamesRep}
					style={{
						borderRight: '1px solid var(--asm-orange)',
						borderLeft: '1px solid var(--asm-orange)',
					}}
					hosts={currentOverlayRep?.live === 'standard-2' ? hostNamesRep : previewHostNamesRep}
				/>

				{raceTimers}

				<SponsorsBoxS sponsorStyle={SponsorSize} tweetStyle={TwitterSize} />
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
};
