import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { OverlayProps, OverlayRef } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, ISmallStyling } from "../elements/info-box/small";

import { SponsorBoxRef, SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { PersonCompressed } from "../elements/couch";
import { getTeams } from "../elements/team-data";
import { TGX24Rainbow, TGX24_COLOURS, TGX24Squares } from "../elements/event-specific/tgx-24/tgx24";

// import WidescreenLeft from "../media/ASM23/widescreen-2-left.png";
// import WidescreenRight from "../media/ASM23/widescreen-2-right.png";
// import WidescreenBottom from "../media/ASM23/widescreen-2-bottom.png";
import tgxBackgroundPattern from "../elements/event-specific/tgx-24/pattern.png";

const Widescreen2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	/* clip-path: path('M1920 0H0V340H666V0H1254V340H1920ZM1920 882H0V1016H1920Z'); */
	clip-path: path("M 1920 0 H 1254 V 341 H 1921 Z M 666 0 H 0 V 341 H 666 M 1920 882 H 0 V 1016 H 1920 Z");
	background: var(--main);
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 341px;
	width: 1920px;
	overflow: hidden;
	border-bottom: 1px solid var(--asm-orange);
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	background: var(--main);
	position: relative;
	background-image: url(${tgxBackgroundPattern});
	background-blend-mode: multiply;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	/* background: var(--main); */
	display: flex;
	flex-direction: column;
	position: relative;
	background: var(--main);
	background-image: url(${tgxBackgroundPattern});
	background-blend-mode: multiply;
`;

const SponsorSize = {
	height: 230,
	width: 540,
};

const TwitterSize = {
	height: 240,
	width: 540,
	marginTop: -40,
};

const CentralDivider = styled.div`
	height: 540px;
	width: 2px;
	position: absolute;
	top: 341px;
	left: 959px;
	background: var(--sec);
`;

const BottomBlock = styled.div`
	position: absolute;
	top: 881px;
	height: 135px;
	width: 1920px;
	/* border-bottom: 1px solid var(--asm-orange); */
	border-top: 1px solid var(--sec);
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: var(--main);
	background-image: url(${tgxBackgroundPattern});
	background-blend-mode: multiply;
`;

const BespokeCouch = styled.div`
	font-family: Noto Sans;
	display: flex;
	align-items: center;
`;

const CouchLabel = styled.span`
	color: var(--text-light);
	font-size: 30px;
	margin-right: 8px;
`;

function indexToColour(index: number) {
	const data = TGX24_COLOURS[index % TGX24_COLOURS.length];
	return {
		color: data.color,
		background: `linear-gradient(45deg, transparent 10px, ${data.background} 10px),
		linear-gradient(315deg, transparent 10px, ${data.background} 10px),
		linear-gradient(225deg, transparent 10px, ${data.background} 10px),
		linear-gradient(135deg, transparent 10px, ${data.background} 10px)`,
		backgroundPosition: "bottom left, bottom right, top right, top left",
		backgroundSize: "51% 51%",
		backgroundRepeat: "no-repeat",
	};
}

const customSmallStyling: ISmallStyling = {
	gameTitleSize: 60,
	gameTitleWidth: 640,
	categoryWidth: 262,
	timerStackHeight: 160,
	mainStyle: {
		width: 666,
		height: "100%",
		// background: 'var(--main)',
		padding: 0,
		zIndex: 2,
	},
	gameNameStyle: {
		lineHeight: "50px",
	},
	lowerStackHeight: 120,
	lowerStackStyle: {
		justifyContent: "space-between",
	},
	timerStyle: {
		flexGrow: 1,
	},
	categoryStyle: {
		width: 284,
	},
};

export const Widescreen2 = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
	const sponsorRef = useRef<SponsorBoxRef>(null);

	useImperativeHandle(ref, () => ({
		showTweet(newVal) {
			sponsorRef.current?.showTweet?.(newVal);
		},
	}));

	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Widescreen2Container>
			<WholeGraphicClip></WholeGraphicClip>
			<Topbar>
				<LeftBox>
					{/* <img
						src={WidescreenLeft}
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
					/> */}
					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="left"
					style={{ position: "absolute", top: 300, left: 624 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === 1}
					side="right"
					style={{
						position: "absolute",
						top: 300,
						right: 624,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={588}
					style={{
						borderRight: "1px solid var(--sec)",
						borderLeft: "1px solid var(--sec)",
						zIndex: 3,
					}}
					teams={props.runData?.teams}
					maxNameWidth={190}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish
					style={{ top: 265, left: 830, zIndex: 3 }}
					time={teamData[0].time}
					place={teamData[0].place}
				/>
				<RaceFinish
					style={{ top: 265, left: 960, zIndex: 3 }}
					time={teamData[1].time}
					place={teamData[1].place}
				/>

				<RightBox>
					{/* <img
						src={WidescreenRight}
						style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover", left: 0 }}
					/> */}
					<SponsorsBox
						ref={sponsorRef}
						style={{ flexGrow: 1 }}
						sponsors={props.sponsors}
						sponsorStyle={SponsorSize}
						tweetStyle={TwitterSize}
					/>
				</RightBox>
			</Topbar>
			<TGX24Rainbow style={{ height: 1, width: 1920, position: "absolute", top: 341, zIndex: 3 }} />
			<TGX24Rainbow style={{ height: 10, width: 1920, position: "absolute", top: 332 }} />
			<CentralDivider />
			<TGX24Rainbow style={{ height: 10, width: 1920, position: "absolute", top: 881, zIndex: 3 }} />
			<BottomBlock>
				{/* <img
					src={WidescreenBottom}
					style={{ position: "absolute", height: "100%", width: "100%", objectFit: "cover" }}
				/> */}
				<TGX24Squares
					style={{ position: "absolute", top: -41, left: -16, transform: "scale(75%) rotate(45deg)" }}
				/>
				<BespokeCouch style={{ marginBottom: 16 }}>
					<CouchLabel>{props.commentators.length > 1 ? "Commentators" : "Commentator"}</CouchLabel>
					{/* Since this is a special placement it has to be made custom here */}
					{props.commentators.map((person, index) => {
						if (person.name === "") return <></>;
						return (
							<PersonCompressed
								key={person.name}
								commentator={person}
								speaking={props.microphoneAudioIndicator?.[person.microphone ?? ""]}
								style={{ ...indexToColour(index) }}
							/>
						);
					})}
					{props.host && (
						<PersonCompressed
							key={"Host"}
							commentator={props.host}
							// speaking={props.obsAudioIndicator?.[host.microphone ?? '']}
							speaking={false}
							host
							style={{ ...indexToColour(props.commentators.length) }}
						/>
					)}
				</BespokeCouch>
			</BottomBlock>

			{/* <svg id="widescreen2Clip">
				<defs>
					<clipPath>
						<polygon points="667,0 1253,0, 1253,341 667,341" />
					</clipPath>
				</defs>
			</svg> */}
		</Widescreen2Container>
	);
});

Widescreen2.displayName = "Widescreen2";
