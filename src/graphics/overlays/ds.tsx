import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { Container } from "../elements/container";
import { SmallInfo } from "../elements/info-box/small";
import { Facecam } from "../elements/facecam";

import DSBG from "./backgrounds/DS.png";
import { GameplayCapture } from "../elements/gameplay-capture";

const DSContainer = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	height: 100%;
	width: 565px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
`;

const InfoBox = styled(Container)`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	border-bottom: 1px solid var(--sec);

	font-size: 25px;
`;

export function DS(props: OverlayProps) {
	return (
		<DSContainer>
			<Sidebar>
				<Facecam
					height={352}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<InfoBox>
					<SmallInfo timer={props.timer} runData={props.runData} />
				</InfoBox>
				<GameplayCapture aspectRatio="4:3" />
			</Sidebar>
			<GameplayCapture aspectRatio="4:3" />
		</DSContainer>
	);
}
