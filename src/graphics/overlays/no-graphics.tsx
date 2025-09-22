import styled from "styled-components";
import { useReplicant } from "@nodecg/react-hooks";
import { Credits } from "../elements/credits";
import { AcknowledgementOfCountry, NameLowerThird } from "../elements/name-lowerthird";
import { LowerThirdPerson } from "extensions/full-screen-data";

const NoGraphicsContainer = styled.div`
	height: 1016px;
	width: 1920px;
	position: relative;
	overflow: hidden;
`;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export const NoGraphics = (props: Props) => {
	const [creditsNameRep] = useReplicant<LowerThirdPerson>("lowerThirdPerson");
	return (
		<NoGraphicsContainer className={props.className} style={props.style}>
			<Credits />
			<div
				style={{
					position: "absolute",
					width: 1920,
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
					width: 1920,
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
		</NoGraphicsContainer>
	);
};
