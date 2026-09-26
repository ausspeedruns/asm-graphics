import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import GBABG from "./backgrounds/GBA.png";

import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

const GBAContainer = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
`;

const Sidebar = styled.div`
	height: 100%;
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

const InfoBoxBG = styled(Container)`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 664px;
	padding: 10px;
	font-size: 25px;
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
					<Couch commentators={props.commentators} audio={props.microphoneAudioIndicator} />
					<VerticalInfo
						timer={props.timer}
						runData={props.runData}
					/>

					<SponsorsBoxS
						sponsors={props.sponsors}
						width={SponsorsStyled.width}
						height={200}
					/>
				</InfoBoxBG>
			</Sidebar>
			<GameplayCapture aspectRatio="3:2" />
		</GBAContainer>
	);
};
