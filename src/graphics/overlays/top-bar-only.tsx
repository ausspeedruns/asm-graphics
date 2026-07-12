import styled from "@emotion/styled";
import { WideInfo } from "../elements/info-box/wide";
import type { OverlayProps } from "../gameplay-overlay";
import { Facecam } from "../elements/facecam";
import { ASM26Felt } from "../elements/asm26/asm26-felt";

const TopBarOnlyContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	overflow: hidden;
`;

const TopBar = styled(ASM26Felt)`
	height: 207px;
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
	background-color: var(--main);
	position: relative;
	padding-bottom: 12px;
	box-sizing: border-box;
`;

export function TopBarOnly(props: OverlayProps) {
	return (
		<TopBarOnlyContainer>
			<TopBar particlesId="top-bar-only-particles">
				<WideInfo timer={props.timer} runData={props.runData} />
			</TopBar>
			<Facecam
				height={41}
				teams={props.runData?.teams}
				pronounStartSide="right"
				audioIndicator={props.microphoneAudioIndicator}
				verticalCoop
			/>
		</TopBarOnlyContainer>
	);
}
