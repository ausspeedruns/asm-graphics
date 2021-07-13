import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { Nameplate } from '../elements/nameplate';

const FishingContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const InfoBox = styled.div`
	height: 300px;
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

const FakeFacecam = styled.div`
	width: 100%;
	height: 358px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
`;

export const Fishing: React.FC<OverlayProps> = (props) => {
	return (
		<FishingContainer>
			<Sidebar>
				{props.runData?.teams[0].players[0] && (
					<FakeFacecam>
						<Nameplate nameplateLeft player={props.runData?.teams[0].players[0]} />
					</FakeFacecam>
				)}
				<InfoBox>
					<VerticalStack style={{ height: 120 }}>
						<RunInfo.GameTitle
							maxWidth={540}
							game={props.runData?.game || ''}
							style={{ fontSize: 50, marginBottom: -10 }}
						/>
						<div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
							<RunInfo.System system={props.runData?.system || ''} style={{ fontSize: 25, zIndex: 2 }} />
							<RunInfo.Year year={props.runData?.release || ''} style={{ fontSize: 25, zIndex: 2 }} />
						</div>
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
				{props.runData?.teams[0].players[1] && (
					<FakeFacecam>
						<Nameplate nameplateLeft player={props.runData?.teams[0].players[1]} />
					</FakeFacecam>
				)}
			</Sidebar>
		</FishingContainer>
	);
};
