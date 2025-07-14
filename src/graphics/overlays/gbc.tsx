import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Circuitry } from "./asm25/circuitry";

// import GBCLeft from "../media/asap24/GBC_01.png";
// import GBCRight from "../media/asap24/GBC_02.png";

const GBCContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 578px;
	border-right: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const RightSidebar = styled.div`
	position: absolute;
	right: 0;
	height: 1016px;
	width: 211px;
	border-left: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const SponsorBoxStyle = styled(SponsorsBox)`
	width: 100%;
	height: 264px;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

const InfoBoxBG = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const customVerticalStyling: IVerticalStyling = {
	maxTextWidth: 540,
	mainStyle: {
		zIndex: 4,
		marginTop: 50,
	},
};

export function GBC(props: OverlayProps) {
	return (
		<GBCContainer>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />
				<InfoBoxBG>
					{/* <img src={GBCLeft} style={{ position: "absolute" }} /> */}
					<Circuitry style={{ position: "absolute", width: "100%", height: "100%" }} />
					<Couch
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
						darkTitle
					/>
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyling} />
					<SponsorBoxStyle sponsorStyle={SponsorsSize} sponsors={props.sponsors} />
				</InfoBoxBG>
			</Sidebar>
			<RightSidebar>
				{/* <img src={GBCRight} style={{ position: "absolute" }} /> */}
				<Circuitry style={{ position: "absolute", width: "100%", height: "100%" }} />
			</RightSidebar>
		</GBCContainer>
	);
}
