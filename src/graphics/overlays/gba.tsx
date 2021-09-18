import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { VerticalInfo, IVerticalStyling } from '../elements/info-box/vertical';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';

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

const SponsorsBoxS = styled(SponsorsBox)`
	width: 100%;
	flex-grow: 1;
`;

const SponsorsStyled = {
	height: 130,
	width: 340,
};

const InfoBoxBG = styled.div`
	background-image: url('../shared/design/contour-maps/standard.svg');
	background-size: cover;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const TwitterSize = {
	height: 158,
	width: 395,
	marginTop: -44,
	fontSize: 14,
};

const customVerticalStyle: IVerticalStyling = {
	maxTextWidth: 360,
	gameTitleSize: 35,
	timerSize: 80,
};

export const GBA: React.FC<OverlayProps> = (props) => {
	return (
		<GBAContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />

					<Couch couch={props.preview ? props.couchInformation.preview : props.couchInformation.current} />
					<SponsorsBoxS sponsorStyle={SponsorsStyled} tweetStyle={TwitterSize} />
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
};
