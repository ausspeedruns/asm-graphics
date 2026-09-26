import styled from "@emotion/styled";
import type { OverlayProps } from "../gameplay-overlay";

import { GameplayCapture } from "../elements/gameplay-capture";
import { Container } from "../elements/container";
import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import StandardBG from "./backgrounds/Standard.png";

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	align-items: stretch;
`;

const Sidebar = styled.div`
	border-right: 1px solid var(--sec);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const InfoBoxBG = styled(Container)`
	// background-image: url(${StandardBG});
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	position: relative;
	padding: 10px 10px 30px;
	box-sizing: border-box;
	flex-grow: 1;

	font-size: 30px;

	#gameTitle {
		max-width: 507px !important;
	}
`;

export const Standard = (props: OverlayProps) => {
	const nameplateMaxWidth = 330 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<StandardContainer>
			<Sidebar>
				<Facecam
					maxNameWidth={nameplateMaxWidth}
					height={352}
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

					<SponsorsBox sponsors={props.sponsors} width="90%" height={150} />
				</InfoBoxBG>
			</Sidebar>
			<GameplayCapture aspectRatio="4:3" />
		</StandardContainer>
	);
};
