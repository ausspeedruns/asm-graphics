import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { IVerticalStyling, VerticalInfo } from '../elements/info-box/vertical';
import { SponsorsBox } from '../elements/sponsors';
import { Facecam } from '../elements/facecam';
import { Couch } from '../elements/couch';

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid #ffc629;
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background-image: url('../shared/design/contour-maps/standard.svg');
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
	mainStyle: { marginBottom: 10 },
};

export const Standard: React.FC<OverlayProps> = (props) => {
	return (
		<StandardContainer>
			<Sidebar>
				<Facecam
					maxNameWidth={400}
					height={352}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch couch={props.preview ? props.couchInformation.preview : props.couchInformation.current} />
					<SponsorBoxS sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} />
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
};
