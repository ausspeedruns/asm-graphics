import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

// import StandardBG from "./backgrounds/Standard.png";

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 600px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const InfoBoxBG = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	flex-grow: 1;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-blend-mode: multiply;
	background-repeat: repeat;
	position: relative;
	padding: 10px 0;
	font-size: 28px;
`;

export function StandardBand(props: OverlayProps) {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<StandardContainer>
			<Sidebar>
				<GameplayCapture aspectRatio="4:3" />
				<Facecam
					height={41}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<InfoBoxBG>
					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						showHost={props.showHost}
					/>
					<VerticalInfo timer={props.timer} runData={props.runData} />
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
}
