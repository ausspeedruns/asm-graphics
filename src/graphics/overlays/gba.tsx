import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import GBABG from "./backgrounds/GBA.png";

import StandardSponsorBG from "./backgrounds/StandardSponsorBG.png";

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
	width: 60%;
	z-index: 2;

	background-image: url(${StandardSponsorBG});
	background-size: cover;
	background-position: center;

	transform: rotate(-6deg) translateY(-5px);
`;

const SponsorsStyled = {
	width: 340,
};

const InfoBoxBG = styled.div`
	position: relative;
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 664px;

	& > div {
		z-index: 1;
	}
`;

const customVerticalStyle: IVerticalStyling = {
	maxTextWidth: 360,
	gameTitleFontSize: 20,
	timerFontSize: 60,
	estimateFontSize: 64,
	categoryFontSize: 40,
	gameInfoFontSize: 48,
	mainStyle: {
		marginBottom: 70,
	},
	gameTitleStyle: {
		maxWidth: "80%",
		minHeight: 40,
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
					<img src={GBABG} style={{ position: "absolute", height: "100%", width: "100%" }} />
					<Couch commentators={props.commentators} host={props.host} audio={props.microphoneAudioIndicator} />
					<VerticalInfo hideDividers timer={props.timer} runData={props.runData} style={customVerticalStyle} />

					<SponsorsBoxS sponsors={props.sponsors} sponsorStyle={SponsorsStyled} />
				</InfoBoxBG>
			</Sidebar>
		</GBAContainer>
	);
};
