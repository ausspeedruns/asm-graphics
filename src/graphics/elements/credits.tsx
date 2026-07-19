import { Fragment, useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";

const CreditsContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	overflow: hidden;
`;

const CreditsPanel = styled.div`
	width: 0;
	height: 100%;
	overflow: hidden;
	background: #000000c4;
`;

const AllCredits = styled.div`
	display: flex;
	flex-direction: column;
	width: 500px;
	align-items: center;
	justify-content: center;
	font-family: Noto Sans;
	color: #ffffff;
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

const PIXELS_PER_SECOND = 100;
const PANEL_WIDTH = 500;
const PANEL_TRANSITION_DURATION = 2;
const FINISH_HOLD_DURATION = 2;

export function Credits() {
	const [creditsRep] = useReplicant("credits");
	const creditsBGRef = useRef<HTMLDivElement>(null);
	const allCreditsRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useListenFor("credits:start", () => {
		const container = creditsBGRef.current;
		const panel = container?.firstElementChild;
		const credits = allCreditsRef.current;

		if (!container || !panel || !credits) return;

		timelineRef.current?.kill();

		const viewportHeight = container.clientHeight;
		const creditsHeight = credits.scrollHeight;
		const scrollDistance = viewportHeight + creditsHeight;
		const scrollDuration = scrollDistance / PIXELS_PER_SECOND;

		gsap.set(panel, { width: 0 });
		gsap.set(credits, { y: viewportHeight });

		const tl = gsap.timeline();
		timelineRef.current = tl;
		tl.to(panel, { width: PANEL_WIDTH, duration: PANEL_TRANSITION_DURATION });
		tl.to(credits, { y: -creditsHeight, duration: scrollDuration, ease: "none" });
		tl.to(panel, { width: 0, duration: PANEL_TRANSITION_DURATION }, `+=${FINISH_HOLD_DURATION}`);
	});

	if (!creditsRep) return null;

	return (
		<CreditsContainer ref={creditsBGRef}>
			<CreditsPanel>
				<AllCredits ref={allCreditsRef}>
					<EventImg>
						<img style={{ width: "90%", height: "auto" }} src={creditsRep.logo} />
					</EventImg>
					<Title>{creditsRep.eventName}</Title>
					{creditsRep.sections.map((section, index) => (
						<Fragment key={index}>
							<Title>{section.title}</Title>
							<NameContainer>
								{section.names.map((name, nameIndex) => (
									<NameWithRoles key={nameIndex}>
										{name.role}
										<span>{name.name}</span>
									</NameWithRoles>
								))}
							</NameContainer>
						</Fragment>
					))}
				</AllCredits>
			</CreditsPanel>
		</CreditsContainer>
	);
}
