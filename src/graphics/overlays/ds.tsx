import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

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
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const DSSecondScreen = styled.div`
	width: 565px;
	height: 424px;
	border-bottom: 1px solid var(--asm-orange);
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
	background: var(--main-col);
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
	background: var(--asm-orange);
`;

const InfoSideDivider = styled.div`
	height: 100px;
	width: 1px;
	background: var(--asm-orange);
`;

export const DS: React.FC<OverlayProps> = (props) => {
	return (
		<DSContainer>
			<Sidebar>
				<DSSecondScreen />
				<Facecam
					height={352}
					teams={props.runData?.teams[0]}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<InfoBox>
					<VerticalStack style={{ height: 120 }}>
						<RunInfo.GameTitle
							maxWidth={540}
							game={props.runData?.game || ''}
							style={{ fontSize: 50, marginBottom: -10 }}
						/>
						<RunInfo.System system={props.runData?.system || ''} style={{ fontSize: 25, zIndex: 2 }} />
					</VerticalStack>
					<InfoTopDivider />
					<InfoSubBox>
						<VerticalStack style={{ height: 80 }}>
							<RunInfo.Category maxWidth={450} category={props.runData?.category || ''} />
							<RunInfo.Estimate fontSize={30} estimate={props.runData?.estimate || ''} />
						</VerticalStack>
						<InfoSideDivider />
						<Timer fontSize={75} timer={props.timer} />
					</InfoSubBox>
				</InfoBox>
			</Sidebar>
		</DSContainer>
	);
};
