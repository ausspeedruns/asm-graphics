import styled from "@emotion/styled";
import { useReplicant } from "@nodecg/react-hooks";
import { Credits } from "../elements/credits";
import { AcknowledgementOfCountry, NameLowerThird } from "../elements/name-lowerthird";
import type { LowerThirdPerson } from "@asm-graphics/shared/FullscreenGraphic";
// import { ASM26NightMode } from "../elements/asm26/asm26-night-mode";

const NoGraphicsContainer = styled.div`
	height: 1016px;
	width: 1920px;
	max-height: 1016px;
	max-width: 1920px;
	position: relative;
	overflow: hidden;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const NoGraphics = (props: Props) => {
	const [creditsNameRep] = useReplicant("lowerThirdPerson");
	return (
		<NoGraphicsContainer className={props.className} style={props.style}>
			<Credits />
			<div
				style={{
					position: "absolute",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					marginTop: -216,
				}}
			>
				<NameLowerThird name={creditsNameRep?.name ?? ""} subtitle={creditsNameRep?.title ?? ""} />
			</div>
			<div
				style={{
					position: "absolute",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					marginTop: -400,
				}}
			>
				<AcknowledgementOfCountry />
			</div>
			{/* <LowerThird
				style={{
					visibility: creditsNameRep.name === '' && creditsNameRep.title === '' ? 'hidden' : 'visible',
				}}>
				<Name>{creditsNameRep.name}</Name>
				<Title>{creditsNameRep.title}</Title>
			</LowerThird> */}
			{/* <div
				style={{
					position: "absolute",
					width: "50%",
					height: "100%",
					overflow: "hidden",
					top: 0,
				}}
			>
				<ASM26NightMode particlesId="rightNightMode" />
			</div>
			<div
				style={{
					position: "absolute",
					width: "50%",
					height: "100%",
					overflow: "hidden",
					top: 0,
					right: 0,
				}}
			>
				<ASM26NightMode particlesId="leftNightMode" />
			</div> */}
		</NoGraphicsContainer>
	);
};
