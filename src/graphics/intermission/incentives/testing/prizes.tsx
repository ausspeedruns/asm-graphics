import { useRef, useState } from "react";
import clsx from "clsx";
import { Button, TextField } from "@mui/material";
import styles from "./testing.module.css";
import type { TickerItemHandles } from "../../incentives";
import gsap from "gsap";
import NumberField from "../../../elements/number-field";
import type { Prize as IPrize } from "@asm-graphics/types/Prizes";
import { Prizes } from "../incent-prizes";

interface PrizesProps {
	showcaseBackgroundColour: string;
	showcaseHeight?: number;
	showcaseWidth?: number;
}

export function PrizesTesting(props: PrizesProps) {
	const [prizes, setPrizes] = useState<IPrize[]>([
		{
			id: "prize-1",
			item: "Item 1",
			subItem: "SubItem 1",
			quantity: 1,
			requirement: "Requirement 1",
			requirementSubheading: "Subheading 1",
		},
		{
			id: "prize-2",
			item: "Item 2",
			subItem: "SubItem 2",
			quantity: 2,
			requirement: "Requirement 2",
			requirementSubheading: "Subheading 2",
		},
	]);

	const ref = useRef<TickerItemHandles>(null);

	function handleRunAnimation() {
		if (!ref.current) return;

		const tl = gsap.timeline();
		ref.current.animation(tl);
		tl.play();
	}

	function handlePrizeChange(index: number, field: keyof IPrize, value: string | number) {
		const newPrizes = [...prizes];

		const originalData = newPrizes[index];
		if (!originalData) return;

		newPrizes[index] = { ...originalData, [field]: value };
		setPrizes(newPrizes);
	}

	return (
		<div className={styles.container}>
			<h2>Prizes</h2>
			<div
				className={clsx(styles.showcase, styles.fullWidth)}
				style={{
					backgroundColor: props.showcaseBackgroundColour,
					height: props.showcaseHeight,
					width: props.showcaseWidth,
				}}
			>
				<Prizes prizes={prizes} ref={ref} />
			</div>
			<div className={styles.controls}>
				<Button onClick={handleRunAnimation}>Run Animation</Button>
				{prizes.map((prize, index) => (
					<div key={index}>
						<TextField
							label={`Prize ${index + 1} Item`}
							variant="outlined"
							value={prize.item}
							onChange={(e) => handlePrizeChange(index, "item", e.target.value)}
						/>
						<TextField
							label={`Prize ${index + 1} SubItem`}
							variant="outlined"
							value={prize.subItem}
							onChange={(e) => handlePrizeChange(index, "subItem", e.target.value)}
						/>
						<NumberField
							label={`Prize ${index + 1} Quantity`}
							value={prize.quantity}
							onValueChange={(value) => handlePrizeChange(index, "quantity", Number(value))}
						/>
						<TextField
							label={`Prize ${index + 1} Requirement`}
							variant="outlined"
							value={prize.requirement}
							onChange={(e) => handlePrizeChange(index, "requirement", e.target.value)}
						/>
						<TextField
							label={`Prize ${index + 1} Requirement Subheading`}
							variant="outlined"
							value={prize.requirementSubheading}
							onChange={(e) => handlePrizeChange(index, "requirementSubheading", e.target.value)}
						/>
					</div>
				))}
				<Button
					variant="outlined"
					onClick={() =>
						setPrizes([
							...prizes,
							{
								id: `prize-${prizes.length + 1}`,
								item: "",
								subItem: "",
								quantity: 1,
								requirement: "",
								requirementSubheading: "",
							},
						])
					}
				>
					Add Prize
				</Button>
				<Button
					variant="outlined"
					onClick={() => setPrizes(prizes.slice(0, -1))}
					disabled={prizes.length === 0}
				>
					Remove Last Prize
				</Button>
			</div>
		</div>
	);
}
