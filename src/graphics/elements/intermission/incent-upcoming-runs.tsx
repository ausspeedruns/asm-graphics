import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { TickerItemHandles } from "./incentives";
import { FitText, FitTextElements } from "../fit-text";
import { RunData } from "@asm-graphics/types/RunData";

import { format } from "date-fns";

const UpcomingRunsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	padding: 16px;
	box-sizing: border-box;
	transform: translate(-100%, 0);
`;

const RunsPage = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
	margin-left: -16px;
	margin-top: -16px;
`;

const RUNS_LIMIT = 2;
const PRIZE_SPEED = 2;
const PRIZE_DURATION = 10;
const PRIZE_PAGE_STAGGER = 0.05;

interface UpcomingRunsProps {
	upcomingRuns: RunData[];
}

export const UpcomingRuns = React.forwardRef<TickerItemHandles, UpcomingRunsProps>((props: UpcomingRunsProps, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const runsRefs = useRef<TickerItemHandles[]>([]);

	const upcomingRunElements: RunData[] = props.upcomingRuns.slice(0, RUNS_LIMIT);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.addLabel("runsStart");
			tl.set(containerRef.current, { xPercent: 100 });
			runsRefs.current.reverse().forEach((prizeRef) => {
				tl.add(prizeRef.animation(tl));
			});
			return tl;
		},
	}));

	return (
		<UpcomingRunsContainer ref={containerRef}>
			<RunsPage>
				{upcomingRunElements.map((run, i) => (
					<Run run={run} index={i} key={i} ref={(el) => (runsRefs.current[i] = el!)} />
				))}
			</RunsPage>
		</UpcomingRunsContainer>
	);
});

UpcomingRuns.displayName = "Runs";

const UpcomingRunContainer = styled.div`
	font-family: var(--secondary-font);
	border-radius: 12px 8px 8px 12px;
	background: white;
	display: flex;
	width: calc(100% - 48px);
	height: 80px;
`;

const MetaDataContainer = styled.div`
	padding: 16px;
	background: var(--asm-orange);
	border-radius: 8px 0 0 8px;
	color: var(--text-light);

	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
`;

const RequirementsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 150px;
`;

const Requirement = styled.span`
	font-weight: bold;
	font-size: 30px;
	text-align: center;
`;

const RequirementSubheading = styled(FitText)`
	font-size: 110%;
	max-width: 150px;
	font-family: var(--main-font);
`;

const Quantity = styled.span`
	font-weight: bold;
	font-size: 50px;
`;

const ItemContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-grow: 1;
	color: var(--text-dark);
	font-size: 45px;
`;

const Item = styled(FitTextElements)`
	font-weight: bold;
	max-width: 720px;
`;

const SubItem = styled.span`
	font-family: var(--main-font);
	font-weight: normal;
	/* margin-left: 16px; */
`;

interface RunProps {
	run: RunData;
	index: number;
	style?: React.CSSProperties;
}

const RUN_STAGGER_INVERSE = 1 / PRIZE_PAGE_STAGGER;

export const Run = React.forwardRef<TickerItemHandles, RunProps>((props: RunProps, ref) => {
	const containerRef = useRef(null);

	const pageTimeOffset = Math.floor(props.index / RUNS_LIMIT) * (PRIZE_DURATION + 1.5);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.fromTo(
				containerRef.current,
				{ xPercent: -110 },
				{ xPercent: 0, duration: PRIZE_SPEED, ease: "power3.out" },
				`upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + pageTimeOffset}`,
			);

			// console.log(`${props.prize.item} | upcomingRuns+=${props.index / PRIZE_STAGGER_INVERSE + pageTimeOffset}`, props.index, PRIZE_STAGGER_INVERSE, pageTimeOffset)

			tl.to(
				containerRef.current,
				{ xPercent: 110, duration: PRIZE_SPEED, ease: "power3.in" },
				`upcomingRuns+=${props.index / RUN_STAGGER_INVERSE + PRIZE_DURATION + pageTimeOffset}`,
			);
			return tl;
		},
	}));

	return (
		<UpcomingRunContainer ref={containerRef} style={props.style}>
			<MetaDataContainer>
				<RequirementsContainer>
					<Requirement>{props.run.scheduled ? format(props.run.scheduled, "h:mm a") : "Soon"}</Requirement>
					{/* {props.run.requirementSubheading && (
						<RequirementSubheading>{props.run.requirementSubheading}</RequirementSubheading>
					)} */}
					<RequirementSubheading
						text={props.run.teams
							.map((team) => team.players.map((player) => player.name))
							.join(", ")}></RequirementSubheading>
				</RequirementsContainer>
				{/* <Quantity>
					{props.run.quantity}
					<span style={{ fontSize: "75%" }}>x</span>
				</Quantity> */}
			</MetaDataContainer>

			<ItemContainer>
				{/* <Item>
					{props.prize.item} <SubItem>{props.prize.subItem}</SubItem>
				</Item> */}
				<Item
					text={
						<>
							{props.run.game}
							<SubItem> - {props.run.category}</SubItem>
						</>
					}
				/>
			</ItemContainer>
		</UpcomingRunContainer>
	);
});
