import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Timer } from '../elements/timer';
import * as RunInfo from '../elements/run-info';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { OrangeStripe } from '../elements/orange-stripe';
import { Couch } from '../elements/couch';
import { ASMBanner } from '../elements/asm-banner';

const DS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
`;

const Sidebar = styled.div`
	/* position: absolute; */
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--asm-orange);
	border-left: 1px solid var(--asm-orange);
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
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const InfoBox = styled.div`
	height: 340px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	/* height: 264px; */
	flex-grow: 1;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

const TwitterSize = {
	height: 163,
    width: 480,
    marginTop: -44
};

export const DS2: React.FC<OverlayProps> = (props) => {
	return (
		<DS2Container>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} noCam={props.preview ? props.noCam.preview : props.noCam.current} />
				<InfoBoxBG>
					<InfoBox>
						<VerticalStack style={{ height: 180 }}>
							<Timer
								fontSize={110}
								timer={props.timer}
								style={{ marginBottom: -15 }}
							/>
							<RunInfo.Estimate
								fontSize={30}
								estimate={props.runData?.estimate || ''}
							/>
						</VerticalStack>
						<InfoDivider />
						<RunInfo.Category
							maxWidth={450}
							category={props.runData?.category || ''}
						/>
						<InfoDivider />
						<VerticalStack style={{ height: 100 }}>
							<RunInfo.GameTitle
								maxWidth={540}
								game={props.runData?.game || ''}
								style={{ fontSize: 37 }}
							/>
							<div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly'}}>
								<RunInfo.System
									system={props.runData?.system || ''}
									style={{ fontSize: 25, zIndex: 2 }}
								/>
								<RunInfo.Year
									year={props.runData?.release || ''}
									style={{ fontSize: 25, zIndex: 2 }}
								/>
							</div>
						</VerticalStack>
					</InfoBox>
					<Couch
						couch={
							props.preview
								? props.couchInformation.preview
								: props.couchInformation.current
						}
					/>
					<ASMBanner />
					<SponsorBoxS
						sponsorStyle={SponsorsSize}
						tweetStyle={TwitterSize}
					/>
					<OrangeStripe side="bottom" style={{ width: '100%' }} />
				</InfoBoxBG>
			</Sidebar>
		</DS2Container>
	);
};
