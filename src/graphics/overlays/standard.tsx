import styled from "styled-components";

import { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { IVerticalStyling, VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import StandardBG from "./backgrounds/Standard.png";

import StandardSponsorBG from "./backgrounds/StandardSponsorBG.png";

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 565px;
	border-right: 1px solid var(--accent);
	overflow: hidden;

	// ASAP2025
	border-right: 1px solid #fff;
`;

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	height: 644px;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-blend-mode: multiply;
	background-repeat: repeat;
	position: relative;
	padding: 10px 0;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 65%;
	/* height: 264px; */
	// flex-grow: 1;
	/* margin-top: -70px; */
	background-image: url(${StandardSponsorBG});
	background-size: cover;
	background-position: center;

	transform: rotate(-6deg) translateY(-20px);
`;

const SponsorsSize = {
	height: 125,
	width: 480,
};

const VerticalInfoS = styled(VerticalInfo)`
	height: 348px;
	z-index: 1;
`;

const customVerticalStyle: IVerticalStyling = {
	timerFontSize: 90,
	gameInfoFontSize: 48,
	gameTitleFontSize: 25,
	gameStackHeight: 200,
	timerStackHeight: 300,
	categoryFontSize: 40,
	estimateFontSize: 64,
	timerStyle: {
		minWidth: 450,
	},
	gameTitleStyle: {
		minWidth: "80%",
		minHeight: 32,
	},
	estimateStyle: {
		marginTop: -18,
	},
	mainStyle: {
		marginBottom: 70,
	}
};

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
					<img src={StandardBG} style={{ position: "absolute", width: "100%", height: "100%" }} />
					<Couch
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
						showHost={props.showHost}
					/>
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} hideDividers />

					<SponsorBoxS sponsors={props.sponsors} sponsorStyle={SponsorsSize} noAsap25Glow />
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
};
