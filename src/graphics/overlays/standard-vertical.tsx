import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Container } from "../elements/container";
import { GameplayCapture } from "../elements/gameplay-capture";

// import StandardBG from "../media/ASM23/standard-vertical-left.png";
// import StandardRightBG from "../media/ASM23/standard-vertical-right.png";

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;

	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
	flex-grow: 2;

	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const InfoBoxBG = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	padding: 10px;
	flex-grow: 1;
`;

const RightSide = styled(Container)`
	border-left: 1px solid var(--sec);
	font-size: 40px;
	padding: 10px;

	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`;

export function StandardVertical(props: OverlayProps) {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<StandardContainer>
			<Sidebar>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={460}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
					verticalCoop
				/>
				<InfoBoxBG>
					{/* <img
						src={StandardBG}
						style={{ position: "absolute", height: "auto", width: "100%", objectFit: "contain", bottom: 0 }}
					/> */}
					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						align="center"
						style={{ width: "fit-content" }}
					/>
				</InfoBoxBG>
			</Sidebar>
			<GameplayCapture aspectRatio="3:4" />
			<RightSide>
				<VerticalInfo timer={props.timer} runData={props.runData} />
				<SponsorsBox sponsors={props.sponsors} width={480} height={240} />
			</RightSide>
		</StandardContainer>
	);
}
