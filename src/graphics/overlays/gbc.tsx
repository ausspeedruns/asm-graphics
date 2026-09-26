import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

// import GBCLeft from "../media/asap24/GBC_01.png";
// import GBCRight from "../media/asap24/GBC_02.png";

const GBCContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	border-right: 1px solid var(--sec);
	flex: 3;
`;

const RightSidebar = styled(Container)`
	flex: 1;
	border-left: 1px solid var(--sec);
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

const InfoBoxBG = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 664px;
	padding: 16px;
	box-sizing: border-box;
	font-size: 30px;
`;

export function GBC(props: OverlayProps) {
	return (
		<GBCContainer>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />
				<InfoBoxBG>
					{/* <img src={GBCLeft} style={{ position: "absolute" }} /> */}
					<Couch commentators={props.commentators} audio={props.microphoneAudioIndicator} darkTitle />
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<SponsorBoxStyle sponsors={props.sponsors} width="90%" height={200} />
				</InfoBoxBG>
			</Sidebar>
			<GameplayCapture aspectRatio="10:9" />
			<RightSidebar>{/* <img src={GBCRight} style={{ position: "absolute" }} /> */}</RightSidebar>
		</GBCContainer>
	);
}
