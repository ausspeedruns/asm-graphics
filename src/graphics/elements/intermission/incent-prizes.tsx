import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { TickerItemHandles } from "./incentives";
import { FitText } from "../fit-text";

const PrizesContainer = styled.div`
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

const PrizesPage = styled.div`
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

export type Prize = {
	requirement: string;
	requirementSubheading?: string;
	quantity?: number;
	item: string;
	subItem?: string;
};

const PRIZE_PAGE_LENGTH = 2;
const PRIZE_SPEED = 2;
const PRIZE_DURATION = 10;
const PRIZE_PAGE_STAGGER = 0.05;

interface PrizesProps {
	prizes: Prize[];
}

export const Prizes = React.forwardRef<TickerItemHandles, PrizesProps>((props: PrizesProps, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const prizesRefs = useRef<TickerItemHandles[]>([]);

	const groupedPrizes: Prize[][] = [];
	for (let i = 0; i < props.prizes.length; i += PRIZE_PAGE_LENGTH) {
		groupedPrizes.push(props.prizes.slice(i, i + PRIZE_PAGE_LENGTH));
	}

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.addLabel("prizesStart");
			tl.set(containerRef.current, { xPercent: 100 });
			prizesRefs.current.reverse().forEach((prizeRef) => {
				tl.add(prizeRef.animation(tl));
			});
			return tl;
		},
	}));

	// for (let i = 0; i < groupedPrizes.length; i++) {
	// 	for (let j = 0; j < groupedPrizes[i].length; j++) {
	// 		console.log(`Prize: ${groupedPrizes[i][j].item} | Index ${i * PRIZE_PAGE_LENGTH + j}`)
	// 	}
	// }

	return (
		<PrizesContainer ref={containerRef}>
			{groupedPrizes.map((prizes, i) => (
				<PrizesPage key={i}>
					{prizes.map((prize, j) => (
						<Prize
							prize={prize}
							index={i * PRIZE_PAGE_LENGTH + j}
							key={prize.item}
							ref={(el) => (prizesRefs.current[i * PRIZE_PAGE_LENGTH + j] = el!)}
						/>
					))}
				</PrizesPage>
			))}
		</PrizesContainer>
	);
});

Prizes.displayName = "Prizes";

const UpcomingRunContainer = styled.div`
	font-family: var(--secondary-font);
	border-radius: 20px 16px 16px 20px;
	background: white;
	display: flex;
	width: calc(100% - 48px);
	height: 80px;
`;

const MetaDataContainer = styled.div`
	padding: 16px;
	background: var(--time);
	border-radius: 16px 0 0 16px;
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
`;

const Requirement = styled.span`
	font-weight: bold;
	font-size: 30px;
	text-align: center;
`;

const RequirementSubheading = styled.span`
	font-size: 100%;
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

const Item = styled(FitText)`
	font-weight: bold;
	max-width: 720px;
`;

// const SubItem = styled.span`
// 	font-weight: normal;
// `;

const renderTextWithLineBreaks = (text: string) => {
	const lines = text.split("\n");
	return lines.map((line, index) => (
		<React.Fragment key={index}>
			{line}
			{index !== lines.length - 1 && <br />}
		</React.Fragment>
	));
};

interface PrizeProps {
	prize: Prize;
	index: number;
}

const PRIZE_STAGGER_INVERSE = 1 / PRIZE_PAGE_STAGGER;

const Prize = React.forwardRef<TickerItemHandles, PrizeProps>((props: PrizeProps, ref) => {
	const containerRef = useRef(null);

	const pageTimeOffset = Math.floor(props.index / PRIZE_PAGE_LENGTH) * (PRIZE_DURATION + 1.5);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.fromTo(
				containerRef.current,
				{ xPercent: -110 },
				{ xPercent: 0, duration: PRIZE_SPEED, ease: "power3.out" },
				`prizesStart+=${props.index / PRIZE_STAGGER_INVERSE + pageTimeOffset}`,
			);

			// console.log(`${props.prize.item} | prizesStart+=${props.index / PRIZE_STAGGER_INVERSE + pageTimeOffset}`, props.index, PRIZE_STAGGER_INVERSE, pageTimeOffset)

			tl.to(
				containerRef.current,
				{ xPercent: 110, duration: PRIZE_SPEED, ease: "power3.in" },
				`prizesStart+=${props.index / PRIZE_STAGGER_INVERSE + PRIZE_DURATION + pageTimeOffset}`,
			);
			return tl;
		},
	}));

	return (
		<UpcomingRunContainer ref={containerRef}>
			<MetaDataContainer>
				<RequirementsContainer>
					<Requirement style={{ fontSize: props.prize.requirement.includes("\n") ? "24px" : "40px" }}>
						{renderTextWithLineBreaks(props.prize.requirement)}
					</Requirement>
					{props.prize.requirementSubheading && (
						<RequirementSubheading>{props.prize.requirementSubheading}</RequirementSubheading>
					)}
				</RequirementsContainer>
				<Quantity>
					{props.prize.quantity}
					<span style={{ fontSize: "75%" }}>x</span>
				</Quantity>
			</MetaDataContainer>

			<ItemContainer>
				{/* <Item>
					{props.prize.item} <SubItem>{props.prize.subItem}</SubItem>
				</Item> */}
				<Item text={props.prize.item} />
			</ItemContainer>
		</UpcomingRunContainer>
	);
});
