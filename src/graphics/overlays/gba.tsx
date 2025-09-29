import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { Circuitry } from "./asm25/circuitry";

// import GBABG from "../elements/event-specific/dh-24/Standard.png";

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
	width: 100%;
	flex-grow: 1;
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
	justify-content: space-evenly;
	align-items: center;
	height: 664px;

	& > div {
		z-index: 1;
	}
`;

const customVerticalStyle: IVerticalStyling = {
	maxTextWidth: 360,
	gameTitleSize: 35,
	timerSize: 60,
	mainStyle: {
		height: 310,
	},
};

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
					<Circuitry
						// src={GBABG}
						style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}
					/>

					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch commentators={props.commentators} host={props.host} audio={props.microphoneAudioIndicator} />

					<SponsorsBoxS sponsors={props.sponsors} sponsorStyle={SponsorsStyled} />
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
};
