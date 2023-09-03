import React from "react";
import styled from "styled-components";

import { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

const GBCContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const RightSidebar = styled.div`
	position: absolute;
	right: 0;
	height: 1016.5px;
	width: 224px;
	border-left: 1px solid var(--pax-gold);
	overflow: hidden;
	background-image: url("../shared/design/contour-maps/standard.svg");
	background-size: cover;
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
	background-image: url("../shared/design/contour-maps/standard.svg");
	background-size: cover;
	background-position: center;
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
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.obsAudioIndicator} />
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyling} />
					<Couch couch={props.couchInformation} audio={props.obsAudioIndicator} />
					<SponsorBoxStyle sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} sponsors={props.sponsors} />
				</InfoBoxBG>
			</Sidebar>
			<RightSidebar />
		</GBCContainer>
	);
};
