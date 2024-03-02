import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch";
import { TGX24Rainbow, TGX24Squares } from "../elements/event-specific/tgx-24/tgx24";

// import WidescreenTop from "../media/ASM23/widescreen-top.png";
// import WidescreenBottom from "../media/ASM23/widescreen-bottom.png";
import Pattern from "../elements/event-specific/tgx-24/pattern.svg";

const WidescreenContainer = styled.div`
	height: 1016px;
	width: 1920px;
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
	border-right: 1px solid var(--tgx-green);
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
			<TopBar>
				<img
					src={Pattern}
					style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
				/>
				<TGX24Squares style={{ position: "absolute", top: 3 }} />
				<TGX24Rainbow style={{ position: "absolute", bottom: 0, width: "100%" }} />
				<WideInfo
					timer={props.timer}
					runData={props.runData}
					style={{ mainStyle: { paddingLeft: 250, paddingRight: 100 } }}
				/>
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
					<img
						src={Pattern}
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
					/>
					<TGX24Rainbow style={{ width: "100%", position: "absolute", top: 0 }} />
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
