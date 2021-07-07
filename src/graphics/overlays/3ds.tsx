import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Facecam } from '../elements/facecam';
import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';

const ThreeDSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 175px;
	height: 841px;
	width: 517px;
	border-right: 1px solid var(--asm-orange);
	/* border-top: 1px solid var(--asm-orange); */
`;

const InfoBar = styled.div`
	background: var(--main-col);
	border-bottom: 1px var(--asm-orange) solid;
	position: absolute;
	height: 174px;
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

const InfoDivider = styled.div`
	height: 77%;
	width: 1px;
	background: var(--asm-orange);
`;

export const ThreeDS: React.FC<OverlayProps> = (props) => {
	return (
		<ThreeDSContainer>
			<InfoBar>
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.GameTitle
						maxWidth={680}
						game={props.runData?.game || ''}
						style={{ marginBottom: -25, marginTop: -4 }}
					/>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
						<RunInfo.System system={props.runData?.system || ''} />
						<RunInfo.Year year={props.runData?.release || ''} />
					</div>
				</VerticalStack>
				<InfoDivider />
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.Category
						maxWidth={420}
						category={props.runData?.category || ''}
						style={{ marginBottom: -25 }}
					/>
					<RunInfo.Estimate estimate={props.runData?.estimate || ''} />
				</VerticalStack>
				<InfoDivider />
				<Timer style={{ width: 612, zIndex: 2 }} timer={props.timer} />
			</InfoBar>
			<Sidebar>
				<Facecam
					style={{ borderBottom: '1px solid var(--asm-orange)' }}
					maxNameWidth={270}
					height={452}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
			</Sidebar>
		</ThreeDSContainer>
	);
};
