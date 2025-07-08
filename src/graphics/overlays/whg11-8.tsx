import styled from "styled-components";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { VerticalInfo, IVerticalStyling } from "../elements/info-box/vertical";
import { SponsorsBox } from "../elements/sponsors";
import { Facecam } from "../elements/facecam";
import { Couch } from "../elements/couch";

// import GBABG from "../media/ASM23/gba.png";

const WHGContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const Sidebar = styled.div`
	position: absolute;
	height: 1016px;
	width: 424px;
	box-sizing: border-box;
	border-right: 1px solid var(--sec);
	overflow: hidden;
`;

const InfoBoxBG = styled.div`
	background: var(--main);
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

const customVerticalStyle: IVerticalStyling = {
	maxTextWidth: 400,
	timerSize: 80,
};

// World's Hardest Game (11:8)
export function WHG(props: OverlayProps) {
	return (
		<WHGContainer>
			<Sidebar>
				<Facecam height={352} teams={props.runData?.teams} />
				<InfoBoxBG>
					{/* <img
						src={GBABG}
						style={{ position: "absolute", height: "auto", width: "100%", objectFit: "contain", bottom: 0 }}
					/> */}
					<VerticalInfo timer={props.timer} runData={props.runData} style={customVerticalStyle} />
					<Couch commentators={props.commentators} host={props.host} style={{ zIndex: 3 }} />
					<SponsorBoxS sponsorStyle={SponsorsSize} sponsors={props.sponsors} />
				</InfoBoxBG>
			</Sidebar>
		</WHGContainer>
	);
};
