import React, { useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';

import { War } from '../../../types/Incentives';
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
	color: #f2dab2;
	font-size: 37px;
	transform: translate(-630px, 0);
	overflow: hidden;
`;

const MultiGoalContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	position: relative;
	padding-top: 100px;
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
	margin: 0 4px 0 8px;
	width: 100%;
`;

// Determines full size
const ProgressContainer = styled.div`
	/* flex-grow: 1; */
	width: 100%;
	min-height: 60px;
	height: 60px;
	background: #f2dab2;
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
	transform: translate(-630px, 0);
	margin: 8px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #251803;
`;

const PrizesTitle = styled.span`
	color: #f2dab2;
	font-size: 40px;
	font-weight: bold;
	width: 100%;
	text-align: center;
	position: absolute;
	top: 0;
`;

interface Props {}

export const InterPrizes = React.forwardRef<TickerItemHandles, Props>((_props: Props, ref) => {
	const containerRef = useRef(null);
	const prizeRefs = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			// Start
			tl.addLabel('warStart');
			tl.set(containerRef.current, { x: -630 });
			tl.to(containerRef.current, { x: 0, duration: 1 });

			for (let i = 0; i < 2; i++) {
				tl.add(prizeRefs.current[i].animation(tl));
			}

			// End
			tl.to(containerRef.current, { x: 630, duration: 1 }, '-=1');
			tl.set(containerRef.current, { x: -630, duration: 1 });

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
					donationTotal="$10 Donation"
					prizes={[
						'Arctis 3 White Headphones',
						'Arctis 3 Black Headphones',
						'Arctis 5 White Headphones'
					]}
					ref={(el) => {
						if (el) {
							prizeRefs.current[0] = el;
						}
					}}
				/>
				<PrizePage
					index="1"
					donationTotal="$20 Donation"
					prizes={[
						'Nanoleaf Hexagons Starter Kit',
						'Nanoleaf Triangles Expansion',
						'Nanoleaf Mini Triangles Expansion',
					]}
					ref={(el) => {
						if (el) {
							prizeRefs.current[1] = el;
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
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	transform: translate(-630px, 0);
`;

const AllOptionContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-grow: 1;
	width: 100%;
	justify-content: flex-start;
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
			tl.to(containerRef.current, { x: 630, duration: 1 }, '+=10');
			tl.set(containerRef.current, { x: -630 });

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

const OptionName = styled(FitText)`
	max-width: 100%;
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
			tl.set(containerRef.current, { x: -630 }, 'warStart');

			tl.to(containerRef.current, { x: 0 }, `idkstagger+=${props.index / 4}`);
			return tl;
		},
	}));

	return (
		<ProgressContainer ref={containerRef}>
			<OptionName text={props.itemName} />
		</ProgressContainer>
	);
});

InterPrizes.displayName = 'InterPrizes';
PrizePage.displayName = 'PrizePage';
PrizeItem.displayName = 'PrizeItem';
