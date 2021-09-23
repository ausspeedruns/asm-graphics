import React from 'react';
import styled from 'styled-components';

import { OverlayProps } from '../../types/OverlayProps';

import { WideInfo } from '../elements/info-box/wide';
import { Facecam } from '../elements/facecam';
import { SponsorsBox } from '../elements/sponsors';
import { Couch } from '../elements/couch';

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	top: 156px;
	height: 863px;
	width: 390px;
	border-right: 1px solid var(--pax-gold);
`;

const SidebarBG = styled.div`
	background-image: url('../shared/design/contour-maps/widescreen-1-bottom.svg');
	background-size: cover;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 446px;
	padding-top: 14px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* position: absolute; */
	width: 60%;
	/* height: 459px; */
	flex-grow: 1;
	/* left: 0px;
	top: 400px; */
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SponsorSize = {
	height: 300,
	width: 300,
};

const TwitterSize = {
	height: 252,
	width: 360,
	marginTop: -41,
};

export const Widescreen: React.FC<OverlayProps> = (props) => {
	return (
		<WidescreenContainer>
			<WideInfo timer={props.timer} runData={props.runData} />
			<Sidebar>
				<Facecam
					maxNameWidth={270}
					height={400}
					teams={props.runData?.teams}
					noCam={props.preview ? props.noCam.preview : props.noCam.current}
				/>
				<SidebarBG>
					<Couch couch={props.preview ? props.couchInformation.preview : props.couchInformation.current} />
					<SponsorBoxS sponsorStyle={SponsorSize} tweetStyle={TwitterSize} />
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
};
