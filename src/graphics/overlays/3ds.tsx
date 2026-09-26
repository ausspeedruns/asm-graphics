import styled from "@emotion/styled";
import type { OverlayProps } from "../gameplay-overlay";

import { Container } from "../elements/container";
import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { GameplayCapture } from "../elements/gameplay-capture";

// import WidescreenTop from "../elements/event-specific/dh-24/Widescreen-2.png";

const ThreeDSContainer = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const TopBar = styled(Container)`
	height: 176px;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	position: relative;
`;

const GameRow = styled.div`
	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	display: flex;
	flex-direction: column;
	width: 520px;
	border-right: 1px solid var(--sec);
	z-index: -1;
`;

export const ThreeDS = (props: OverlayProps) => {
	return (
		<ThreeDSContainer>
			<TopBar>
				{/* <img
					src={WidescreenTop}
					style={{ opacity: 0.8, position: "absolute", height: 175, width: 1295.35, right: -100 }}
				/> */}
				<div
					style={{
						position: "absolute",
						bottom: 0,
						height: 8,
						width: "100%",
						background: "var(--dh-orange-to-red)",
					}}
				/>
				<WideInfo timer={props.timer} runData={props.runData} />
			</TopBar>
			<GameRow>
				<Sidebar>
					<Facecam
						// style={{ borderBottom: '1px solid #FFC629' }}
						maxNameWidth={270}
						height={451}
						teams={props.runData?.teams}
						pronounStartSide="right"
						audioIndicator={props.microphoneAudioIndicator}
					/>
					<GameplayCapture aspectRatio="4:3" />
				</Sidebar>
				<GameplayCapture aspectRatio="5:3" />
			</GameRow>
		</ThreeDSContainer>
	);
};
