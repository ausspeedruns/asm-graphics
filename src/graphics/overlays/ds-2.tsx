import styled from "@emotion/styled";

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

const Middle = styled.div`
	position: relative;
	height: 1016px;
	width: 564px;
	border-right: 1px solid var(--pax-gold);
	border-left: 1px solid var(--pax-gold);
	overflow: hidden;
`;

const InfoBox = styled.div`
	background: var(--main);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 664px;
	padding: 16px;
`;

const SponsorBoxS = styled(SponsorsBox)`
	width: 100%;
	/* height: 264px; */
`;

const SponsorsSize = {
	height: 130,
	width: 430,
};

export const DS2 = (props: OverlayProps) => {
	const teamData = getTeams(props.runData, props.timer, 2);

	return (
		<DS2Container>
			<Middle>
				<Facecam height={352} teams={props.runData?.teams} audioIndicator={props.microphoneAudioIndicator} />

				<RaceFinish style={{ top: 276, left: 830 }} time={teamData[0]?.time} place={teamData[0]?.place ?? -1} />
				<RaceFinish style={{ top: 276, left: 960 }} time={teamData[1]?.time} place={teamData[1]?.place ?? -1} />

				<AudioIndicator
					active={props.gameAudioIndicator === 0}
					side="top"
					style={{ position: "absolute", top: 270, left: 678 }}
				/>
				<AudioIndicator
					active={props.gameAudioIndicator === 1}
					side="top"
					style={{
						position: "absolute",
						top: 270,
						right: 678,
						zIndex: 2,
					}}
				/>
				<InfoBox>
					<Couch commentators={props.commentators} style={{ zIndex: 2 }} />
					<VerticalInfo timer={props.timer} runData={props.runData} />
					<SponsorBoxS sponsorStyle={SponsorsSize} sponsors={props.sponsors} style={{ zIndex: 2 }} />
				</InfoBox>
			</Middle>
		</DS2Container>
	);
};
