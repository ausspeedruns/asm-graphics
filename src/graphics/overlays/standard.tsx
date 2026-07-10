import styled from "@emotion/styled";

import type { OverlayProps } from "../gameplay-overlay";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import StandardBG from "./backgrounds/Standard.png";
import { ASM26Bricks } from "../elements/asm26/asm26-bricks";
import AdWreath from "../media/asm26/ad-wreath.png";

const StandardContainer = styled.div`
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

const InfoBoxBG = styled(ASM26Bricks)`
	// background: var(--main);
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

const ASM26WreathContainer = styled.div`
	position: relative;
	background: #369cdb;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
	padding: 30px 60px;
`;

const ASM26Wreath = styled.img`
	position: absolute;
	top: -50px;
	left: -50px;
	width: calc(100% + 100px);
	height: calc(100% + 100px);
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 230px;
	height: 100px;
	margin-left: -20px;
`;

const SponsorsSize = {
	height: 125,
	width: 480,
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
				<InfoBoxBG particlesId="infoBox">
					{/* <img src={StandardBG} style={{ position: "absolute", width: "100%", height: "100%" }} /> */}

					<Couch
						commentators={props.commentators}
						audio={props.microphoneAudioIndicator}
						showHost={props.showHost}
					/>

					<VerticalInfo timer={props.timer} runData={props.runData} hideDividers />

					{/* <div style={{ flexGrow: 1 }} /> */}

					<ASM26WreathContainer>
						<ASM26Wreath src={AdWreath} />
						<SponsorBoxS sponsors={props.sponsors} sponsorStyle={SponsorsSize} />
					</ASM26WreathContainer>
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
};
