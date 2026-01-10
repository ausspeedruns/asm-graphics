import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

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
	border-left: 1px solid var(--accent);
	overflow: hidden;
	background: var(--main);
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
	padding: 16px;
	background: var(--main);
`;

export function GBC(props: OverlayProps) {
	return (
		<GBCContainer>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />
				<InfoBoxBG>
					{/* <img src={GBCLeft} style={{ position: "absolute" }} /> */}
					<Couch
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
						darkTitle
					/>
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<SponsorBoxStyle sponsorStyle={SponsorsSize} sponsors={props.sponsors} />
				</InfoBoxBG>
			</Sidebar>
			<RightSidebar>{/* <img src={GBCRight} style={{ position: "absolute" }} /> */}</RightSidebar>
		</GBCContainer>
	);
}
