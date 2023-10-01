import React from "react";
import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";
import { AudioIndicator } from "../elements/audio-indicator";
import { RaceFinish } from "../elements/race-finish";
import { getTeams } from "../elements/team-data";

const DS2Container = styled.div`
	height: 1016px;
	width: 1920px;
	display: flex;
	justify-content: center;
	position: relative;
`;

const Sidebar = styled.div`
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--pax-gold);
	border-left: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background-image: url("../shared/design/contour-maps/standard.svg");
	background-size: cover;
	background-position: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	/* height: 264px; */
	flex-grow: 1;
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

const TwitterSize = {
	height: 163,
	width: 480,
	marginTop: -44,
};

export const DS2: React.FC<OverlayProps> = (props) => {

	const { teamData, gameAudioActive } = getTeams(props.runData, props.timer, props.audioIndicator, 2);

	return (
		<DS2Container>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />

				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[0].time} place={teamData[0].place} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[1].time} place={teamData[1].place} />

				<AudioIndicator
					active={gameAudioActive === 0}
					side="top"
					style={{ position: "absolute", top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={gameAudioActive === 1}
					side="top"
					style={{
						position: "absolute",
						top: 270,
						right: 678,
						zIndex: 2,
					}}
				/>
				<InfoBoxBG>
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<Couch commentators={props.commentators} />
					<SponsorBoxS sponsorStyle={SponsorsSize} tweetStyle={TwitterSize} sponsors={props.sponsors} />
				</InfoBoxBG>
			</Sidebar>
		</DS2Container>
	);
};
