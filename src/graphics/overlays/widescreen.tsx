import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { Container } from "../elements/container";
import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch";

import WidescreenTop from "./backgrounds/WidescreenTop.png";
import WidescreenBottom from "./backgrounds/WidescreenBottom.png";
import { GameplayCapture } from "../elements/gameplay-capture";

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	display: flex;
	flex-direction: column;
`;

const TopBar = styled(Container)`
	flex: 1;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	position: relative;
	box-sizing: border-box;
`;

const Sidebar = styled.div`
	height: 100%;
	max-width: 460px;
	border-right: 1px solid var(--sec);
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const GameplayRow = styled.div`
	display: flex;
	flex-direction: row;
	align-items: stretch;
`;

const SidebarBG = styled(Container)`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	flex: 1;
	overflow: hidden;
	padding: 10px;
`;

export const Widescreen = (props: OverlayProps) => {
	const nameplateMaxWidth = 200 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<WidescreenContainer>
			{/* <div
				style={{
					position: "absolute",
					zIndex: 1,
					width: "100%",
					height: "100%",
					clipPath: "path('M 0 0 H 1920 V 207 H 0 Z M 0 556 H 479 V 1017 H 0 Z')",
				}}
			/> */}
			<TopBar>
				<WideInfo timer={props.timer} runData={props.runData} />
			</TopBar>
			<GameplayRow>
				<Sidebar>
					<Facecam
						maxNameWidth={nameplateMaxWidth}
						height={400}
						teams={props.runData?.teams}
						pronounStartSide="right"
						audioIndicator={props.microphoneAudioIndicator}
						verticalCoop
					/>
					<SidebarBG>
						<Couch
							style={{ zIndex: 2 }}
							commentators={props.commentators}
							audio={props.microphoneAudioIndicator}
							darkTitle
						/>

						{props.onScreenWarning?.show && (
							<div
								style={{
									background: "#f00",
									fontWeight: "bold",
									zIndex: 2,
									width: "80%",
									color: "white",
									padding: "0.5rem",
									textAlign: "center",
									textWrap: "balance",
									fontSize: "1.3rem",
								}}
							>
								{props.onScreenWarning?.message}
							</div>
						)}

						<SponsorsBox sponsors={props.sponsors} width="90%" height={200} />
					</SidebarBG>
				</Sidebar>
				<GameplayCapture aspectRatio="16:9" grow />
			</GameplayRow>
		</WidescreenContainer>
	);
};
