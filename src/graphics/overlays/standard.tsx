import styled from "styled-components";

import { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { IVerticalStyling, VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

// import StandardBG from "./backgrounds/Standard.png";	
import { Circuitry } from "./asm25/circuitry";

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
`;

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 644px;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-blend-mode: multiply;
	background-repeat: repeat;
	position: relative;
	padding: 10px 0
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* width: 65%; */
	/* height: 264px; */
	flex-grow: 1;
	/* margin-top: -70px; */
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
	timerSize: 90,
	gameInfoSize: 20,
	gameTitleSize: 40,
	gameStackHeight: 200,
	timerStackHeight: 300,
	categorySize: 38,
	mainStyle: {
		// marginTop: 40,
	},
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
					<Circuitry
						// src={StandardBG}
						bigShadowAngle={90}
						style={{
							position: "absolute",
							height: "100%",
							width: "100%",
							objectFit: "contain",
							zIndex: -1,
						}}
					/>
					<Couch commentators={props.commentators} host={props.host} audio={props.microphoneAudioIndicator} />
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />

					<SponsorBoxS sponsors={props.sponsors} sponsorStyle={SponsorsSize} />
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
};
