import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { SmallInfo, ISmallStyling } from "../elements/info-box/small";
import { SponsorsBox } from "../elements/sponsors";
import { AudioIndicator } from "../elements/audio-indicator";
import { Facecam } from "../elements/facecam";
import { RaceFinish } from "../elements/race-finish";
import { Couch } from "../elements/couch";
import { getTeams } from "../elements/team-data";

import GBA2p from "./backgrounds/GBA2p.png";

const Standard2Container = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
`;

const Topbar = styled.div`
	display: flex;
	position: absolute;
	height: 376px;
	width: 1920px;
	border-bottom: 1px solid var(--asm-orange);
	overflow: hidden;
`;

const LeftBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	position: relative;
`;

const RightBox = styled.div`
	width: 666px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
`;

const SponsorSize = {
	height: 230,
	width: 430,
	marginRight: -40,
};

const CentralDivider = styled.div`
	height: 639px;
	width: 2px;
	position: absolute;
	top: 377px;
	left: 959px;
	background: var(--asm-orange);
`;

const customSmallStyling: ISmallStyling = {
	categoryWidth: 265,
	timerStackHeight: 188,
	lowerStackHeight: 188,
	mainStyle: {
		height: "100%",
		width: "100%",
		zIndex: 1,
		padding: 0,
	},
	lowerStackStyle: {
		justifyContent: "space-between",
	},
	timerStyle: {
		flexGrow: 1,
	},
	gameNameStyle: {
		lineHeight: "42px",
	},
	categoryStyle: {
		width: 284,
	},
};

export const GBA2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<Standard2Container>
			<img src={GBA2p} style={{ position: "absolute", height: "100%", width: "100%" }} />

			<Topbar>
				<LeftBox>
					<SmallInfo timer={props.timer} runData={props.runData} style={customSmallStyling} />
				</LeftBox>

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="left"
					style={{ position: "absolute", top: 255, left: 625 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === 1}
					side="right"
					style={{
						position: "absolute",
						top: 255,
						right: 625,
						zIndex: 2,
					}}
				/>

				<Facecam
					width={586}
					maxNameWidth={190}
					style={{
						borderRight: "1px solid var(--asm-orange)",
						borderLeft: "1px solid var(--asm-orange)",
					}}
					teams={props.runData?.teams}
					audioIndicator={props.microphoneAudioIndicator}
				/>

				<RaceFinish style={{ top: 220, left: 830 }} time={teamData[0].time} place={teamData[0].place} />
				<RaceFinish style={{ top: 220, left: 960 }} time={teamData[0].time} place={teamData[0].place} />

				<RightBox>
					<div
						style={{
							display: "flex",
							width: "100%",
							flexGrow: 1,
							alignItems: "center",
						}}
					>
						<Couch
							commentators={props.commentators}
							host={props.host}
							style={{ width: "30%", zIndex: 3 }}
							audio={props.microphoneAudioIndicator}
						/>
						<SponsorsBox sponsors={props.sponsors} style={{ flexGrow: 1 }} sponsorStyle={SponsorSize} />
					</div>
				</RightBox>
			</Topbar>
			<CentralDivider />
		</Standard2Container>
	);
};
