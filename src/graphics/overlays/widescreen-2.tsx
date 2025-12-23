import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, type ISmallStyling } from "../elements/info-box/small-asap25";

import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { PersonCompressed } from "../elements/couch";
import { getTeams } from "../elements/team-data";

// import WidescreenWhole from "./backgrounds/Widescreen2p.png";

const Widescreen2Container = styled.div`
	height: 1016px;
	width: 1920px;
`;

const WholeGraphicClip = styled.div`
	position: absolute;
	width: 1920px;
	height: 1016px;
	clip-path: path("M 1920 0 H 1254 V 341 H 1921 Z M 666 0 H 0 V 341 H 666 M 1920 882 H 0 V 1016 H 1920 Z");
	// background: var(--main);
	z-index: 1;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 341px;
	width: 1920px;
	overflow: hidden;
	border-bottom: 1px solid var(--sec);
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	// background: var(--main);
	position: relative;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	/* background: var(--main); */
	display: flex;
	flex-direction: column;
	position: relative;
	/* background: var(--main); */
	z-index: 2;
`;

const SponsorSize = {
	height: 230,
	width: 540,
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
	/* background: var(--main); */
	z-index: 2;
`;

const BespokeCouch = styled.div`
	font-family: Noto Sans;
	display: flex;
	align-items: center;
	gap: 8px;
	z-index: 2;
`;

const CouchLabel = styled.span`
	color: var(--text-light);
	font-size: 30px;
	margin-right: 8px;
	padding: 0px 10px;
	border-radius: 8px;
	background: var(--asm24-main-transparent);
	backdrop-filter: blur(4px);
`;

const customSmallStyling: ISmallStyling = {
	gameTitleFontSize: 60,
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

export const Widescreen2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Widescreen2Container>
			<WholeGraphicClip>
				{/* <img
					src={WidescreenWhole}
					style={{ position: "absolute", height: "100%", width: "100%" }}
				/> */}
			</WholeGraphicClip>
			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="left"
					style={{ position: "absolute", top: 300, left: 624, zIndex: 2 }}
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
					time={teamData[0]?.time}
					place={teamData[0]?.place ?? -1}
				/>
				<RaceFinish
					style={{ top: 265, left: 960, zIndex: 3 }}
					time={teamData[1]?.time}
					place={teamData[1]?.place ?? -1}
				/>

				<RightBox>
					<SponsorsBox
						style={{ flexGrow: 1, zIndex: 2 }}
						sponsors={props.sponsors}
						sponsorStyle={SponsorSize}
					/>
				</RightBox>
			</Topbar>
			<CentralDivider />
			<BottomBlock>
				<BespokeCouch>
					{/* <CouchLabel>{props.commentators.length > 1 ? "Commentators" : "Commentator"}</CouchLabel> */}
					{/* Since this is a special placement it has to be made custom here */}
					{props.commentators.map((person, i) => {
						if (person.name === "" || person.id === "host") return <></>;
						return (
							<PersonCompressed
								key={person.name}
								commentator={person}
								speaking={props.microphoneAudioIndicator?.[person.microphone ?? ""]}
								index={i}
							/>
						);
					})}
					{props.host && (
						<PersonCompressed
							key={"Host"}
							commentator={props.host}
							// speaking={props.obsAudioIndicator?.[host.microphone ?? '']}
							speaking={false}
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
};
