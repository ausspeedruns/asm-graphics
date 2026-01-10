import styled from "@emotion/styled";

import type { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { WideInfo } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";
import { SponsorsBox } from "../elements/sponsors";
import { Couch } from "../elements/couch";

import WidescreenTop from "./backgrounds/WidescreenTop.png";
import WidescreenBottom from "./backgrounds/WidescreenBottom.png";
import { CloudScrolling } from "./aso2026/clouds";

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
	padding-bottom: 12px;
	box-sizing: border-box;
`;

const Sidebar = styled.div`
	position: absolute;
	bottom: 0;
	height: 810px;
	width: 479px;
	border-right: 1px solid var(--accent);
	/* z-index: -1; */
	overflow: hidden;
`;

const SidebarBG = styled.div`
	/* background: var(--main); */
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 410px;
	position: relative;
	/* border-top: 1px solid var(--sec); */
	overflow: hidden;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	z-index: 1;
`;

const SponsorBoxS = styled(SponsorsBox)`
	/* position: absolute; */
	width: 80%;
	/* height: 459px; */
	/* left: 0px;
	top: 400px; */
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
`;

const SponsorSize = {
	height: 250,
	width: 315,
};

export const Widescreen = (props: OverlayProps) => {
	const nameplateMaxWidth = 200 / (props.runData?.teams?.[0]?.players?.length ?? 1) + 70;

	return (
		<WidescreenContainer>
			{/* <div
				style={{
					position: "absolute",
					zIndex: 1,
					width: "100%",
					height: "100%",
					clipPath: "path('M 0 0 H 1920 V 207 H 0 Z M 0 556 H 479 V 1017 H 0 Z')",
				}}
			/> */}
			<TopBar>
				{/* ASO2026 Sky */}
				<div
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						background: "linear-gradient(to bottom, #005fbf, #00b3c9)",
					}}
				/>
				{/* ASO2026 Clouds */}
				<CloudScrolling style={{ bottom: -20, height: 80, position: "absolute" }} />
				<img
					src={WidescreenTop}
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
					}}
				/>
				<WideInfo timer={props.timer} runData={props.runData} />
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
						src={WidescreenBottom}
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							zIndex: 0,
						}}
					/>
					<Couch
						style={{ zIndex: 2, marginTop: 8 }}
						commentators={props.commentators}
						host={props.host}
						audio={props.microphoneAudioIndicator}
						darkTitle
					/>
					{props.onScreenWarning?.show && (
						<div
							style={{
								background: "#f00",
								fontWeight: "bold",
								zIndex: 2,
								width: "80%",
								color: "white",
								padding: "0.5rem",
								textAlign: "center",
								textWrap: "balance",
								fontSize: "1.3rem",
							}}
						>
							{props.onScreenWarning?.message}
						</div>
					)}
					<SponsorBoxS sponsors={props.sponsors} sponsorStyle={SponsorSize} />
				</SidebarBG>
			</Sidebar>
		</WidescreenContainer>
	);
};
