import { useImperativeHandle, useRef } from "react";
import styled from "@emotion/styled";

import type { TickerItemHandles } from "../incentives";
import { FitText, FitTextElements } from "../../elements/fit-text";
import type { RunData } from "@asm-graphics/types/RunData";

import { format } from "date-fns";

import ASM26Background from "../../media/asm26/ASM26_Carousel.png";
import ASM26Bow from "../../media/asm26/Carosuel_Bow_Blue.png";

const UpcomingRunsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	box-sizing: border-box;
`;

const RunsPage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4px;
`;

const RUNS_LIMIT = 2;
const RUNS_SPEED = 2;
const RUNS_DURATION = 10;
const RUNS_PAGE_STAGGER = 0.05;

interface UpcomingRunsProps {
	upcomingRuns: RunData[];
	ref: React.Ref<TickerItemHandles>;
}

export function UpcomingRuns(props: UpcomingRunsProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const runsRefs = useRef<TickerItemHandles[]>([]);

	const upcomingRunElements = props.upcomingRuns.slice(0, RUNS_LIMIT);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			tl.addLabel("runsStart");
			tl.set(containerRef.current, { xPercent: 100 });
			runsRefs.current.reverse().forEach((runRef) => {
				tl.add(runRef.animation(tl));
			});
			return tl;
		},
	}));

	return (
		<UpcomingRunsContainer ref={containerRef}>
			<RunsPage>
				{upcomingRunElements.map((run, i) => (
					<Run
						run={run}
						index={i}
						key={i}
						ref={(el) => {
							runsRefs.current[i] = el!;
						}}
					/>
				))}
			</RunsPage>
		</UpcomingRunsContainer>
	);
}

const BORDER_RADIUS = 4;

const UpcomingRunContainer = styled.div`
	font-family: var(--secondary-font);
	border-radius: ${BORDER_RADIUS + 4}px ${BORDER_RADIUS}px ${BORDER_RADIUS}px ${BORDER_RADIUS + 4}px; // +4 because if it is the same as the MetaDataContainer it gets aliasing artifacts
	// background: white;
	width: calc(1484px / 2);
	height: calc(223px / 2);
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	background-image: url(${ASM26Background});
	display: flex;
	// width: 100%;
	// flex-grow: 1;
	font-size: 22px;
`;

const MetaDataContainer = styled.div`
	padding: 4px;
	// background: var(--asm-orange);
	border-radius: ${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px;
	color: var(--text-light);

	display: flex;
	align-items: center;
	justify-content: space-evenly;
`;

const RequirementsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 150px;
`;

const Requirement = styled.span`
	font-weight: bold;
	font-size: 80%;
	text-align: center;
`;

const RequirementSubheading = styled(FitText)`
	font-size: 100%;
	max-width: 150px;
	font-family: var(--main-font);
`;

const ItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	flex-grow: 1;
	color: var(--text-light);
	font-size: 100%;
`;

const Item = styled(FitTextElements)`
	font-weight: bold;
	max-width: 450px;
`;

const SubItem = styled(FitTextElements)`
	font-family: var(--main-font);
	font-weight: normal;
	max-width: 450px;
	margin-top: -8px;
	font-size: 75%;
	/* margin-left: 16px; */
`;

interface RunProps {
	run: RunData;
	index: number;
	style?: React.CSSProperties;
	ref: React.Ref<TickerItemHandles>;
}

const RUN_STAGGER_INVERSE = 1 / RUNS_PAGE_STAGGER;

export const Run = (props: RunProps) => {
	const containerRef = useRef(null);

	const pageTimeOffset = Math.floor(props.index / RUNS_LIMIT) * (RUNS_DURATION + 1.5);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			tl.fromTo(
				containerRef.current,
				{ xPercent: -110 },
				{ xPercent: 0, duration: RUNS_SPEED, ease: "power3.out" },
				`upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + pageTimeOffset}`,
			);

			// console.log(`${props.run.game} | upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + pageTimeOffset}`, props.index, RUN_STAGGER_INVERSE, pageTimeOffset)

			tl.to(
				containerRef.current,
				{ xPercent: 110, duration: RUNS_SPEED, ease: "power3.in" },
				`upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + RUNS_DURATION + pageTimeOffset}`,
			);
			return tl;
		},
	}));

	return (
		<UpcomingRunContainer ref={containerRef} style={props.style}>
			<MetaDataContainer>
				<RequirementsContainer>
					<Requirement>{props.run.scheduled ? format(props.run.scheduled, "h:mm a") : "Soon"}</Requirement>
					<RequirementSubheading
						text={props.run.teams.map((team) => team.players.map((player) => player.name)).join(", ")}
					/>
				</RequirementsContainer>
			</MetaDataContainer>
			<img src={ASM26Bow} style={{ height: "100%" }} />
			<ItemContainer>
				<Item text={<>{props.run.game}</>} />
				<SubItem text={props.run.category} />
			</ItemContainer>
		</UpcomingRunContainer>
	);
};
