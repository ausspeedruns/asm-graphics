import styled from "@emotion/styled";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import GBABG from "./backgrounds/GBA.png";

import StandardSponsorBG from "./backgrounds/StandardSponsorBG.png";

const GBAContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 395px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
`;

const SponsorsBoxS = styled(SponsorsBox)`
	width: 60%;
	height: 200px;
	z-index: 2;
`;

const SponsorsStyled = {
	width: 340,
};

const InfoBoxBG = styled.div`
	position: relative;
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 664px;
`;

export const GBA = (props: OverlayProps) => {
	return (
		<GBAContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
				/>
				<InfoBoxBG>
					{/* <img src={GBABG} style={{ position: "absolute", height: "100%", width: "100%" }} /> */}
					<Couch commentators={props.commentators} host={props.host} audio={props.microphoneAudioIndicator} />
					<VerticalInfo
						hideDividers
						timer={props.timer}
						runData={props.runData}
					/>

					<SponsorsBoxS sponsors={props.sponsors} sponsorStyle={SponsorsStyled} />
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
};
