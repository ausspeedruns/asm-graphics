import { useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useListenFor } from "@nodecg/react-hooks";

import EventLogo from "../overlays/backgrounds/logo.png";
import { useReplicant } from "@nodecg/react-hooks";

const CreditsContainer = styled.div`
	position: relative;
	/* left: 0; */
	/* display: flex;
	justify-content: center; */
	width: 100%;
	height: 100%;

	* {
		white-space: nowrap;
	}
`;

const AllCredits = styled.div`
	display: flex;
	flex-direction: column;
	width: 0px;
	align-items: center;
	justify-content: center;
	font-family: Noto Sans;
	background: #000000c4;
	color: #ffffff;
	margin: auto;
	padding-top: 1016px;
	padding-bottom: 1200px;
`;

const EventImg = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Title = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	font-size: 30px;
	margin-top: 30px;
	font-family:
		Russo One,
		sans-serif;
	text-align: center;
`;

const NameContainer = styled.div`
	font-size: 26px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const Name = styled.span`
	margin: 15px 0;
	font-family: Noto Sans;
`;

const NameWithRoles = styled.div`
	font-weight: bold;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 10px;
	text-align: center;

	& > span {
		margin-top: -5px;
		font-weight: normal !important;
	}
`;

const PIXELS_PER_SECOND = 200;

export function Credits() {
	const [creditsRep] = useReplicant("credits");
	const creditsBGRef = useRef<HTMLDivElement>(null);
	const allCreditsRef = useRef<HTMLDivElement>(null);
	const [totalHeight, setTotalHeight] = useState(0);

	useLayoutEffect(() => {
		if (!allCreditsRef.current) return;
		const height = allCreditsRef.current.offsetHeight;
		setTotalHeight(height);
	}, [creditsRep]);

	useListenFor("credits:start", () => {
		const tl = gsap.timeline();
		// Start credits
		tl.to(allCreditsRef.current, { width: 500, duration: 2 });
		const duration = totalHeight / PIXELS_PER_SECOND;
		tl.to(allCreditsRef.current, { marginTop: -totalHeight + 850, duration, ease: "none" }, "+=1");
		tl.to(allCreditsRef.current, { width: 0, duration: 2 });
	});

	if (!creditsRep) return null;

	return (
		<CreditsContainer ref={creditsBGRef}>
			<AllCredits ref={allCreditsRef}>
				<EventImg>
					<img style={{ width: "90%", height: "auto" }} src={creditsRep.logo} />
				</EventImg>
				<Title>{creditsRep.eventName}</Title>
				{creditsRep.sections.map((section, index) => (
					<>
						<Title key={index}>{section.title}</Title>
						<NameContainer>
							{section.names.map((name, nameIndex) => (
								<NameWithRoles key={nameIndex}>
									{name.role}
									<span>{name.name}</span>
								</NameWithRoles>
							))}
						</NameContainer>
					</>
				))}
			</AllCredits>
		</CreditsContainer>
	);
}
