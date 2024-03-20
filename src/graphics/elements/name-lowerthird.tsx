import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useListenFor } from "use-nodecg";
import gsap from "gsap";

import AusSpeedrunsLogo from "../media/AusSpeedruns-Icon.svg";
import IndigenousFlags from "../media/IndigenousFlags.png";

const NameLowerThirdContainer = styled.div`
	display: flex;
`;

const LogoContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background: #ffffff;
	overflow: hidden;
	width: 0;
`;

const Logo = styled.img`
	height: 90px;
	width: 90px;
	object-fit: contain;
	padding: 12px;
`;

const TextContainer = styled.div`
	background: var(--orange-500);
	color: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 12px 0;
	overflow: hidden;
	box-sizing: border-box;
	width: 0;
`;

const Name = styled.div`
	font-family: var(--secondary-font);
	font-size: 42px;
	line-height: 42px;
	white-space: nowrap;
	padding: 0 12px;
`;

const Subtitle = styled.div`
	font-family: var(--main-font);
	font-size: 34px;
	line-height: 34px;
	white-space: nowrap;
	padding: 0 12px;
`;

interface Props {
	name: string;
	subtitle: string;
	className?: string;
	style?: React.CSSProperties;
}

export const NameLowerThird = (props: Props) => {
	const LogoRef = useRef(null);
	const TextRef = useRef(null);
	const [tl] = useState(gsap.timeline);

	useListenFor("show-lowerthird", () => {
		tl.clear();
		tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.to([LogoRef.current, TextRef.current], { width: "auto", duration: 1 });
		tl.play();
	});

	useListenFor("hide-lowerthird", () => {
		tl.clear();
		tl.to([LogoRef.current, TextRef.current], { width: 0, duration: 1 });
		// tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.play();
	});

	return (
		<NameLowerThirdContainer className={props.className} style={props.style}>
			<LogoContainer ref={LogoRef}>
				<Logo src={AusSpeedrunsLogo} />
			</LogoContainer>
			<TextContainer ref={TextRef}>
				<Name>{props.name}</Name>
				<Subtitle>{props.subtitle}</Subtitle>
			</TextContainer>
		</NameLowerThirdContainer>
	);
};

const IndigenousFlagsImage = styled.img`
	height: 256px;
	width: 203px;
	object-fit: contain;
	padding: 12px;
`;

const AcknowledgementText = styled.div`
	font-family: var(--main-font);
	font-size: 29px;
	padding: 0 24px;
	text-align: justify;
	width: 1034px;
`;

interface AcknowledgementOfCountryProps {
	className?: string;
	style?: React.CSSProperties;
}

export const AcknowledgementOfCountry = (props: AcknowledgementOfCountryProps) => {
	const LogoRef = useRef(null);
	const TextRef = useRef(null);
	const [tl] = useState(gsap.timeline);

	useListenFor("show-acknowledgementofcountry", () => {
		tl.clear();
		tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.addLabel("open");
		tl.to(LogoRef.current, { width: "auto", duration: 1 }, "open");
		tl.to(TextRef.current, { width: 1082, duration: 1 }, "open");
		tl.play();
	});

	useListenFor("hide-acknowledgementofcountry", () => {
		tl.clear();
		tl.to([LogoRef.current, TextRef.current], { width: 0, duration: 1 });
		// tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.play();
	});

	return (
		<NameLowerThirdContainer className={props.className} style={props.style}>
			<LogoContainer ref={LogoRef}>
				<IndigenousFlagsImage src={IndigenousFlags} />
			</LogoContainer>
			<TextContainer ref={TextRef}>
				<AcknowledgementText>
					AusSpeedruns acknowledges the traditional owners of the lands on which we are gathered for this
					event, the Wurundjeri Woi Wurrung people of the Kulin Nation, and their continued connection to
					Country. We pay our respects to their elders past and present, and extend that respect any First
					Nations people in attendance today. AusSpeedruns also acknowledges the traditional owners of the
					many lands, waterways and ecosystems on which our viewers from home are joining us.
				</AcknowledgementText>
			</TextContainer>
		</NameLowerThirdContainer>
	);
};
