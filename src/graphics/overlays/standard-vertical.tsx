import styled from "styled-components";

import { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { IVerticalStyling, VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

// import StandardBG from "../media/ASM23/standard-vertical-left.png";
// import StandardRightBG from "../media/ASM23/standard-vertical-right.png";

const StandardContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 578px;
	border-right: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 664px;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* width: 65%; */
	/* height: 264px; */
`;

const RightSide = styled.div`
	position: absolute;
	height: 1016px;
	width: 578px;
	right: 0;
	border-left: 1px solid var(--asm-orange);
	background: var(--main);
	background-position: center;
	background-repeat: none;

	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
`;

const SponsorsSize = {
	height: 240,
	width: 480,
};

const VerticalInfoS = styled(VerticalInfo)`
	height: 348px;
`;

const customVerticalStyle: IVerticalStyling = {
	timerSize: 75,
	gameInfoSize: 20,
	gameTitleSize: 40,
	gameStackHeight: 100,
	timerStackHeight: 200,
	categorySize: 38,
};

export const StandardVertical = (props: OverlayProps) => {
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
						style={{ zIndex: 3, paddingTop: 32, transform: "scale(1.2)" }}
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
					/>
				</InfoBoxBG>
			</Sidebar>
			<RightSide>
				<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />
				<SponsorBoxS
					sponsors={props.sponsors}
					sponsorStyle={SponsorsSize}
				/>
			</RightSide>
		</StandardContainer>
	);
};
