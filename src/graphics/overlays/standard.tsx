import { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { IVerticalStyling, VerticalInfo } from "../elements/info-box/vertical";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

import StandardBG from "./backgrounds/Standard.png";

import ACMILogo from '../media/ACMI_Logo_RGB_White.svg'

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
	height: 664px;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-blend-mode: multiply;
	background-repeat: repeat;
	background-position-y: 10px;
	position: relative;

	* {
		filter: drop-shadow(-5px 6px 3px rgba(0, 0, 0, 0.1));
	}
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

const TwitterSize = {
	height: 200,
	width: 480,
	marginTop: -44,
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
	}
};

export const Standard = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

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
					style={{ borderBottom: "12px solid var(--accent)" }}
				/>
				<InfoBoxBG>
					<img
						src={StandardBG}
						style={{
							position: "absolute",
							height: "auto",
							width: "100%",
							objectFit: "contain",
							bottom: 0,
							zIndex: -1,
						}}
					/>
					<Couch
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
					/>
					<VerticalInfoS timer={props.timer} runData={props.runData} style={customVerticalStyle} />

					{/* <img src={ACMILogo} style={{ width: '60%', height: 'auto', marginBottom: 20 }} /> */}
					<SponsorBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorsSize}
						tweetStyle={TwitterSize}
					/>
				</InfoBoxBG>
			</Sidebar>
		</StandardContainer>
	);
});

Standard.displayName = "Standard";
