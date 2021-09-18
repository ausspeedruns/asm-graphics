import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { VerticalInfo, IVerticalStyling } from '../elements/info-box/vertical';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { ASMBanner } from '../elements/asm-banner';
import { OrangeStripe } from '../elements/orange-stripe';
import { Couch } from '../elements/couch';

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
	background: var(--main-col);
`;

const SponsorBoxStyle = styled(SponsorsBox)`
	width: 100%;
	height: 264px;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

const TwitterSize = {
	height: 142,
	width: 558,
	marginTop: -47,
};

const InfoBoxBG = styled.div`
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const customVerticalStyling: IVerticalStyling = {
	maxTextWidth: 540,
};

export const GBC: React.FC<OverlayProps> = (props) => {
	return (
		<GBCContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyling} />
					<Couch couch={props.preview ? props.couchInformation.preview : props.couchInformation.current} />
					<ASMBanner />
					<SponsorBoxStyle sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} />
					<OrangeStripe side="bottom" style={{ width: '100%' }} />
				</InfoBoxBG>
			</Sidebar>
			<RightSidebar>
				<OrangeStripe side="left" style={{ position: 'absolute' }} />
			</RightSidebar>
		</GBCContainer>
	);
};
