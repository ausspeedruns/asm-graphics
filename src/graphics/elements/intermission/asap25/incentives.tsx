import styled from "@emotion/styled";
import type { Incentive, War } from "@asm-graphics/types/Incentives";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Props {
	incentives?: Incentive[];
	style?: React.CSSProperties;
}

const MAX_INCENTIVES = 3;

export function Incentives(props: Props) {
	if (!props.incentives || props.incentives.length === 0) return null;

	const displayedIncentives = props.incentives.slice(0, MAX_INCENTIVES);

	return (
		<div style={{ display: "flex", gap: 20, ...props.style }}>
			{displayedIncentives.map((incentive) => (
				<IncentiveItem key={incentive.id} incentive={incentive} />
			))}
		</div>
	);
}

interface IncentiveItemProps {
	incentive: Incentive;
}

function IncentiveItem(props: IncentiveItemProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-end",
				fontSize: 30,
				width: 500,
				lineHeight: 1.2,
			}}
		>
			{/* Top Row: Game and Incentive Name */}
			<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 4 }}>
				<span style={{ textAlign: "right", fontWeight: "bold" }}>{props.incentive.game}</span>
				<span style={{ textAlign: "right" }}>{props.incentive.incentive}</span>
				{props.incentive.type === "Goal" ? (
					<span style={{ textAlign: "right" }}>
						<span style={{ fontWeight: "bold" }}>${props.incentive.total}</span> / ${props.incentive.goal}
					</span>
				) : (
					<WarOptionsAnimation options={props.incentive.options} />
				)}
			</div>
		</div>
	);
}

interface WarOptionsAnimationProps {
	options: War["options"];
}

const FADE_DURATION = 1;
const DISPLAY_DURATION = 3 * 1000;

function WarOptionsAnimation(props: WarOptionsAnimationProps) {
	const [current, setCurrent] = useState(0);
	const optionRef = useRef<HTMLDivElement>(null);

	if (props.options.length === 0)
		return (
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<span style={{ fontWeight: "bold", marginLeft: 8 }}>Submit a choice!</span>
			</div>
		);

	// Sort options from highest total to lowest
	const sortedOptions = [...props.options].sort((a, b) => b.total - a.total);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		const animate = () => {
			if (optionRef.current) {
				gsap.fromTo(
					optionRef.current,
					{ opacity: 0 },
					{
						opacity: 1,
						duration: FADE_DURATION,
						onComplete: () => {
							timeout = setTimeout(() => {
								gsap.to(optionRef.current, {
									opacity: 0,
									duration: FADE_DURATION,
									onComplete: () => {
										setCurrent((prev) => (prev + 1) % sortedOptions.length);
									},
								});
							}, DISPLAY_DURATION);
						},
					},
				);
			}
		};
		animate();
		return () => clearTimeout(timeout);
	}, [current, sortedOptions.length]);

	const option = sortedOptions[current];

	return (
		<div ref={optionRef} style={{ display: "flex", justifyContent: "space-between" }}>
			<span>{option?.name}</span>
			<span style={{ fontWeight: "bold", marginLeft: 8 }}>${option?.total}</span>
		</div>
	);
}
