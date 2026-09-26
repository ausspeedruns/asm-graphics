import styled from "@emotion/styled";
import { GameplayCapture } from "../elements/gameplay-capture";
import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Container } from "../elements/container";

// import Background from "./backgrounds/1x1.png";

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	width: 564px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const InfoBox = styled(Container)`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	flex: 1;
	padding: 10px;
	font-size: 28px;
`;

const FullGraphicClip = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 1080px;
	width: 1920px;
	clip-path: path("M 0 352 H 564 V 1016 H 0 Z M 1583 0 H 1920 V 1016 H 1583 Z");
	overflow: hidden;
`;

const RightBox = styled(Container)`
	flex: 1;
	border-left: 1px solid var(--sec);
`;

export function OneByOne(props: OverlayProps) {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<StandardContainer>
			<FullGraphicClip>
				{/* <img src={Background} style={{ position: "absolute", width: "100%", height: "100%" }} /> */}
			</FullGraphicClip>
			<Sidebar>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<InfoBox>
					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						showHost={props.showHost}
					/>

					<VerticalInfo timer={props.timer} runData={props.runData} />

					<SponsorsBox sponsors={props.sponsors} width={480} height={125} />
				</InfoBox>
			</Sidebar>
			<GameplayCapture aspectRatio="1:1" />
			<RightBox />
		</StandardContainer>
	);
}
