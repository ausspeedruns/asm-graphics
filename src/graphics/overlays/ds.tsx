import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { SmallInfo } from "../elements/info-box/small";
import { Facecam } from "../elements/facecam";

import DSBG from "./backgrounds/DS.png";

const DSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
`;

const InfoBox = styled.div`
	position: relative;
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 240px;
	border-bottom: 1px solid var(--sec);
`;

const DSSecondScreen = styled.div`
	width: 564px;
	height: 423px;
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
					<img src={DSBG} style={{ position: "absolute", width: "100%", height: "100%" }} />
					<SmallInfo timer={props.timer} runData={props.runData} />
				</InfoBox>
				<DSSecondScreen />
			</Sidebar>
		</DSContainer>
	);
}
