import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { Timer } from '../elements/timer';
import { SponsorsBox } from '../elements/sponsors';
import * as RunInfo from '../elements/run-info';
import { Facecam } from '../elements/facecam';
import { OrangeStripe } from '../elements/orange-stripe';
import { Couch } from '../elements/couch';
import { ASMBanner } from '../elements/asm-banner';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 144px;
	height: 872px;
	width: 523px;
	border-right: 1px solid var(--asm-orange);

	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	overflow: hidden;
`;

const SponsorsBoxS = styled(SponsorsBox)`
	width: 100%;
	background: var(--main-col);
	flex-grow: 1;
`;

const SidebarBG = styled.div`
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 458px;
	padding-top: 14px;
`;

const InfoBar = styled.div`
	background: var(--main-col);
	position: absolute;
	height: 144px;
	width: 1920px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-bottom: 1px var(--asm-orange) solid;
`;

const InfoDivider = styled.div`
	height: 77%;
	width: 1px;
	background: var(--asm-orange);
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	height: 100%;
`;

const SponsorsStyled = {
	height: 250,
	width: 400
};

const TwitterSize = {
	height: 248,
    width: 438,
    marginTop: -36,
};

export const Widescreen1610: React.FC<OverlayProps> = (props) => {
	return (
		<WidescreenContainer>
			<InfoBar>
				<VerticalStack style={{ flexGrow: 1 }}>
					<RunInfo.GameTitle
						maxWidth={680}
						game={props.runData?.game || ''}
						style={{ marginBottom: -15 }}
					/>
					<RunInfo.System system={props.runData?.system || ''} />
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
				<Timer style={{ width: 587, zIndex: 2 }} timer={props.timer} />
			</InfoBar>

			<Sidebar>
				<Facecam height={400} teams={props.runData?.teams[0]} />
				<SidebarBG>
					<Couch
						couch={props.preview ? props.couchInformation.preview : props.couchInformation.current}
					/>
					<ASMBanner style={{marginTop: 4}} />
					<SponsorsBoxS
						sponsorStyle={SponsorsStyled}
						tweetStyle={TwitterSize}
					/>

					<OrangeStripe side="bottom" style={{ width: '100%' }} />
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
};
