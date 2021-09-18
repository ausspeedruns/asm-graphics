import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { VerticalInfo, IVerticalStyling } from '../elements/info-box/vertical';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { OrangeStripe } from '../elements/orange-stripe';
import { Couch } from '../elements/couch';
import { ASMBanner } from '../elements/asm-banner';

const WHGContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 423px;
	box-sizing: border-box;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background: var(--main-col);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
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
	marginTop: -44,
};

const customVerticalStyle: IVerticalStyling = {
	maxTextWidth: 400,
};

// World's Hardest Game (11:8)
export const WHG: React.FC<OverlayProps> = (props) => {
	return (
		<WHGContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch couch={props.preview ? props.couchInformation.preview : props.couchInformation.current} />
					<ASMBanner />
					<SponsorBoxS sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} />
					<OrangeStripe side="bottom" style={{ width: '100%' }} />
				</InfoBoxBG>
			</Sidebar>
		</WHGContainer>
	);
};
