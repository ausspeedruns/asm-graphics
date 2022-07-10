import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

import { TickerItemHandles } from './incentives';
import { FitText } from '../fit-text';

const InterPrizesContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-transform: uppercase;
	color: var(--text-light);
	font-size: 37px;
	transform: translate(-1000px, 0);
	overflow: hidden;
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	position: relative;
	padding-top: 60px;
`;

const Goal = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const IncentiveName = styled(FitText)`
	font-size: 28px;
	/* font-weight: bold; */
	max-width: 600px;
`;

const IncentiveContainer = styled(Goal)`
	// position: absolute;
	display: flex;
	align-items: center;
	margin: 5px;
	width: 100%;
`;

// Determines full size
const ProgressContainer = styled.div`
	/* flex-grow: 1; */
	min-height: 110px;
	height: 110px;
	background: var(--main);
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	transform: translate(-1000px, 0);
	/* margin: 8px 0; */
	padding: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--text-light);
`;

const PrizesTitle = styled.span`
	color: var(--text-light);
	font-size: 30px;
	font-weight: bold;
	width: 100%;
	text-align: center;
	position: absolute;
	top: 5px;
`;

interface Props {}

export const InterPrizes = React.forwardRef<TickerItemHandles, Props>((_props: Props, ref) => {
	const containerRef = useRef(null);
	const prizeRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.addLabel('warStart');
			tl.set(containerRef.current, { x: -1000 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < 2; i++) {
				tl.add(prizeRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '-=1');
			tl.set(containerRef.current, { x: -1000, duration: 1 });

			return tl;
		},
	}));

	return (
		<InterPrizesContainer ref={containerRef}>
			<PrizesTitle>Prizes (AUS Only)</PrizesTitle>
			<MultiGoalContainer>
				{/* <PrizePage index='1' donationTotal="$20" prizes={["Pingas"]} ref={(el) => el = el ? prizeRefs.current[0] : null}/> */}
				<PrizePage
					index="0"
					donationTotal="$40 Donation"
					prizes={['HyperX Cloud II Headsets']}
					ref={(el) => {
						if (el) {
							prizeRefs.current[0] = el;
						}
					}}
				/>
				<PrizePage
					index="0"
					donationTotal="$20 Donation"
					prizes={['HyperX Cloud Gaming Earbuds']}
					ref={(el) => {
						if (el) {
							prizeRefs.current[1] = el;
						}
					}}
				/>
				<PrizePage
					index="1"
					donationTotal="$10 Donation"
					prizes={[
						'Landfall Games Pack (TABS, Clustertruck, Knightfall)',
					]}
					ref={(el) => {
						if (el) {
							prizeRefs.current[2] = el;
						}
					}}
				/>
			</MultiGoalContainer>
		</InterPrizesContainer>
	);
});

const PrizeItemContainer = styled.div`
	position: absolute;
	width: 100%;
	/* height: 100%; */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	transform: translate(-1000px, 0);
`;

const AllOptionContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100px;
	justify-content: center;
	gap: 15px;
	margin-top: 10px;
`;

interface GoalProps {
	donationTotal: string;
	index: string;
	prizes: string[];
}

const PrizePage = React.forwardRef<TickerItemHandles, GoalProps>((props: GoalProps, ref) => {
	const containerRef = useRef(null);
	const optionRefs = useRef<TickerItemHandles[]>([]);
	const [animLabel] = useState(props.index + 'a');

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.to(containerRef.current, { x: 0, duration: 1 }, '-=0.5');

			tl.addLabel('idkstagger');
			tl.addLabel(animLabel, `+=${props.prizes.length / 4}`);
			optionRefs.current.reverse().forEach((optionRef) => {
				tl.add(optionRef.animation(tl), '-=1');
			});

			// End
			tl.to(containerRef.current, { x: 1000, duration: 1 }, '+=10');
			tl.set(containerRef.current, { x: -1000 });

			return tl;
		},
	}));

	const allPrizes = props.prizes
		.map((prize, i) => {
			return (
				<PrizeItem
					animLabel={animLabel}
					itemName={prize}
					key={prize}
					index={props.prizes.length - 1 - i}
					ref={(el) => {
						if (el) {
							optionRefs.current[i] = el;
						}
					}}
				/>
			);
		})
		.reverse();

	return (
		<PrizeItemContainer ref={containerRef}>
			<IncentiveContainer>
				<IncentiveName text={props.donationTotal} />
			</IncentiveContainer>
			<AllOptionContainer>{allPrizes}</AllOptionContainer>
		</PrizeItemContainer>
	);
});

// const OptionName = styled(FitText)`
// 	max-width: 100%;
// `;

const Option = styled.span`
	text-align: center;
	font-size: 26px;
`;

interface PrizeItemProps {
	itemName: string;
	animLabel: string;
	index: number;
}

const PrizeItem = React.forwardRef<TickerItemHandles, PrizeItemProps>((props: PrizeItemProps, ref) => {
	const containerRef = useRef(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.set(containerRef.current, { x: -1000 }, 'warStart');

			tl.to(containerRef.current, { x: 0 }, `idkstagger+=${1 - props.index / 4}`);
			return tl;
		},
	}));

	return (
		<ProgressContainer ref={containerRef}>
			{/* <OptionName text={props.itemName} /> */}
			<Option>{props.itemName}</Option>
		</ProgressContainer>
	);
});

InterPrizes.displayName = 'InterPrizes';
PrizePage.displayName = 'PrizePage';
PrizeItem.displayName = 'PrizeItem';
