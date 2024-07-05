import { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { WideInfo, WideInfo3D } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch";
import { SceneHill } from "../elements/event-specific/asm-24/scene-hill";

// import DreamhackLogo from "../elements/event-specific/dh-24/DreamHack_Logo_RGB_WHITE.png";
// import WidescreenTop from "../elements/event-specific/dh-24/Widescreen-2.png";
// import WidescreenBottom from "../elements/event-specific/dh-24/Widescreen-1.png";

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const TopBar = styled.div`
	height: 207px;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-color: var(--main);
	position: relative;
	/* border-bottom: 1px solid var(--sec); */
`;

const Sidebar = styled.div`
	position: absolute;
	top: 156px;
	height: 860px;
	width: 479px;
	border-right: 1px solid var(--dh-red);
	z-index: -1;
	overflow: hidden;
`;

const SidebarBG = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 449px;
	padding-top: 14px;
	position: relative;
	/* border-top: 1px solid var(--sec); */
	overflow: hidden;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* position: absolute; */
	width: 100%;
	/* height: 459px; */
	flex-grow: 1;
	/* left: 0px;
	top: 400px; */
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SponsorSize = {
	height: 250,
	width: 315,
};

const TwitterSize = {
	height: 252,
	width: 360,
	marginTop: -41,
};

export const Widescreen = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	const nameplateMaxWidth = 200 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<WidescreenContainer>
			<div
				style={{
					position: "absolute",
					zIndex: 1,
					width: "100%",
					height: "100%",
					clipPath: "path('M 0 0 H 1920 V 207 H 0 Z M 0 556 H 479 V 1017 H 0 Z')",
				}}>
				<SceneHill
					time={props.asm24Time}
					positions={{ hillXPos: -2.5 }}
					contentStyle="widescreen"
					runData={props.runData}
					speedrunTime={props.timer}
				/>
			</div>
			<TopBar>
				{/* <img src={WidescreenTop} style={{ position: "absolute", height: "100%", right: -100 }} /> */}
				{/* <div
					style={{
						position: "absolute",
						bottom: 0,
						height: 8,
						width: "100%",
						background: "var(--dh-orange-to-red)",
					}}
				/> */}
				{/* <WideInfo timer={props.timer} runData={props.runData} /> */}
			</TopBar>
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
					<div
						style={{
							position: "absolute",
							top: 0,
							height: 8,
							width: "100%",
							background: "var(--dh-orange-to-red)",
						}}
					/>
					{/* <img
						src={WidescreenBottom}
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover", marginTop: -5 }}
					/> */}
					<Couch
						style={{ zIndex: 2 }}
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
					/>
					<SponsorBoxS
						sponsors={props.sponsors}
						ref={sponsorRef}
						sponsorStyle={SponsorSize}
						tweetStyle={TwitterSize}
					/>
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
});

Widescreen.displayName = "Widescreen";
