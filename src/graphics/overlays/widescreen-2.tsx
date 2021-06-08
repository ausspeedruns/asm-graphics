import React from 'react';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
// @ts-ignore
// import Twemoji from 'react-twemoji';

import { RunDataActiveRun } from '../../types/RunData';
import { Timer as TimerType } from '../../types/Timer';
import { RunnerNames } from '../../types/ExtraRunData';
import { CurrentOverlay } from '../../types/CurrentOverlay';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { SponsorsBox } from '../elements/sponsors';
import { AudioIndicator } from '../elements/audio-indicator';
import { Facecam } from '../elements/facecam';
import { RaceFinish } from '../elements/race-finish';

const Widescreen2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 341px;
	width: 1920px;
	overflow: hidden;
	border-bottom: 1px solid var(--asm-orange);
`;

const InfoTopDivider = styled.div`
	height: 1px;
	width: 652px;
	background: var(--asm-orange);
`;

const InfoSideDivider = styled.div`
	height: 160px;
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
	height: 540px;
	width: 2px;
	position: absolute;
	top: 341px;
	left: 959px;
	background: var(--asm-orange);
`;

const BottomBlock = styled.div`
	position: absolute;
	top: 881px;
	height: 134px;
	width: 1920px;
	background: var(--main-col), url('../shared/design/ASLogoBlack.svg');
	background-size: 37px;
	background-blend-mode: hard-light;
	border-bottom: 1px solid var(--asm-orange);
	overflow: hidden;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const HashtagText = styled.span`
	font-family: Noto Sans;
	color: #ffffff96;
	margin-right: 20px;
	font-size: 80px;
`;

export const Widescreen2: React.FC = () => {
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
				<RaceFinish
					style={{ top: 265, left: 830, zIndex: 3 }}
					time={timerRep}
					teamID={runnerNamesRep[0]?.id || ''}
				/>
				<RaceFinish
					style={{ top: 265, left: 960, zIndex: 3 }}
					time={timerRep}
					teamID={runnerNamesRep[1]?.id || ''}
				/>
			</>
		);
	}

	return (
		<Widescreen2Container>
			<Topbar>
				<InfoBox>
					<VerticalStack style={{ height: 100 }}>
						<RunInfo.GameTitle
							maxWidth={620}
							game={runDataActiveRep?.game || ''}
							style={{ fontSize: 50 }}
						/>
						<RunInfo.System system={runDataActiveRep?.system || ''} style={{ fontSize: 25, zIndex: 2 }} />
					</VerticalStack>
					<InfoTopDivider />
					<InfoSubBox>
						<VerticalStack style={{ height: 120 }}>
							<RunInfo.Category maxWidth={290} category={runDataActiveRep?.category || ''} />
							<RunInfo.Estimate fontSize={30} estimate={runDataActiveRep?.estimate || ''} />
						</VerticalStack>
						<InfoSideDivider />
						<Timer fontSize={75} timer={timerRep} />
					</InfoSubBox>
				</InfoBox>

				<AudioIndicator
					active={audioIndicatorRep === (runnerNamesRep[0]?.id || '')}
					side="left"
					style={{ position: 'absolute', top: 300, left: 624 }}
				/>
				<AudioIndicator
					active={audioIndicatorRep === (runnerNamesRep[1]?.id || '')}
					side="right"
					style={{ position: 'absolute', top: 300, right: 624, zIndex: 2 }}
				/>

				<Facecam
					width={588}
					name={runnerNamesRep}
					style={{
						borderRight: '1px solid var(--pax-west)',
						borderLeft: '1px solid var(--pax-aus)',
						zIndex: 2,
					}}
					hosts={currentOverlayRep?.live === 'widescreen-2' ? hostNamesRep : previewHostNamesRep}
				/>

				{raceTimers}

				<SponsorsBoxS sponsorStyle={SponsorSize} tweetStyle={TwitterSize} />
			</Topbar>
			<CentralDivider />
			<BottomBlock>
				<HashtagText>#ASM2021</HashtagText>
			</BottomBlock>
		</Widescreen2Container>
	);
};
