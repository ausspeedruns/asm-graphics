import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';

const GBAContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 395px;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoDivider = styled.div`
	height: 1px;
	width: 90%;
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

const SponsorsBoxS = styled(SponsorsBox)`
	width: 100%;
	height: 264px;
`;

const SponsorsStyled = {
	height: 220,
	width: 340,
};

const InfoBoxBG = styled.div`
	background: var(--main-col);
`;

export const GBA: React.FC<OverlayProps> = (props) => {
	return (
		<GBAContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams[0]}
				/>
				<InfoBoxBG>
					<InfoBox>
						<VerticalStack style={{ height: 180 }}>
							<Timer fontSize={80} timer={props.timer} style={{ marginBottom: -15 }} />
							<RunInfo.Estimate fontSize={30} estimate={props.runData?.estimate || ''} />
						</VerticalStack>
						<InfoDivider />
						<RunInfo.Category maxWidth={450} category={props.runData?.category || ''} />
						<InfoDivider />
						<VerticalStack style={{ height: 100 }}>
							<RunInfo.GameTitle
								maxWidth={360}
								game={props.runData?.game || ''}
								style={{ fontSize: 35 }}
							/>
							<RunInfo.System
								system={props.runData?.system || ''}
								style={{ fontSize: 20, zIndex: 2 }}
							/>
						</VerticalStack>
					</InfoBox>

					<SponsorsBoxS sponsorStyle={SponsorsStyled} tweetStyle={SponsorsStyled} />
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
};
