import React from "react";
import styled from "styled-components";

import { OverlayProps } from "@asm-graphics/types/OverlayProps";

import { WideInfo, IWideStyling } from "../elements/info-box/wide";
import { Facecam } from "../elements/facecam";

import WidescreenTop from "../elements/event-specific/dh-24/Widescreen-2.png";

const ThreeDSContainer = styled.div`
	height: 1016px;
	width: 1920px;
`;

const TopBar = styled.div`
	height: 175px;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-color: var(--main);
	position: relative;
	/* border-bottom: 1px solid var(--sec); */
`;

const Sidebar = styled.div`
	position: absolute;
	top: 175px;
	height: 841px;
	width: 517px;
	border-right: 1px solid var(--sec);
	z-index: -1;
`;

const customWideStyle: IWideStyling = {
	mainStyle: {
		height: 174,
	},
};

export const ThreeDS: React.FC<OverlayProps> = (props) => {
	return (
		<ThreeDSContainer>
			<TopBar>
				<img
					src={WidescreenTop}
					style={{ opacity: 0.8, position: "absolute", height: 175, width: 1295.35, right: -100 }}
				/>
				<div
					style={{
						position: "absolute",
						bottom: 0,
						height: 8,
						width: "100%",
						background: "var(--dh-orange-to-red)",
					}}
				/>
				<WideInfo timer={props.timer} runData={props.runData} style={customWideStyle} />
			</TopBar>
			<Sidebar>
				<Facecam
					// style={{ borderBottom: '1px solid #FFC629' }}
					maxNameWidth={270}
					height={452}
					teams={props.runData?.teams}
					pronounStartSide="right"
					audioIndicator={props.microphoneAudioIndicator}
				/>
			</Sidebar>
		</ThreeDSContainer>
	);
};
