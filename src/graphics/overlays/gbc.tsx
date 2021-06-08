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

const GBCContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const RightSidebar = styled.div`
	position: absolute;
	right: 0;
	height: 1016px;
	width: 224px;
	border-left: 1px solid var(--asm-orange);
	overflow: hidden;
	background: var(--main-col), url('../shared/design/ASLogoBlack.svg');
	background-size: 37px;
	background-blend-mode: hard-light;
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

const InfoBox = styled.div`
	height: 400px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
`;

const SponsorBoxStyle = styled(SponsorsBox)`
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

const InfoBoxBG = styled.div`
	background: var(--main-col);
`;

export const GBC: React.FC = () => {
	// const [currentTweet] = useReplicant<ITweet, undefined>('currentTweet', undefined);
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
		<GBCContainer>
			<Sidebar>
				<Facecam
					height={352}
					name={runnerNamesRep}
					hosts={currentOverlayRep?.live === 'gbc' ? hostNamesRep : previewHostNamesRep}
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

					<SponsorBoxStyle sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} />
				</InfoBoxBG>
			</Sidebar>
			<RightSidebar />
		</GBCContainer>
	);
};
