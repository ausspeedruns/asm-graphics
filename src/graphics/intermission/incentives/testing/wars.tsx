import { useRef, useState } from "react";
import clsx from "clsx";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import styles from "./testing.module.css";
import { WarGame } from "../incent-wars";
import type { TickerItemHandles } from "../../incentives";
import gsap from "gsap";
import type { War } from "@asm-graphics/types/Incentives";
import NumberField from "../../../elements/number-field";

interface WarsProps {
	showcaseBackgroundColour: string;
	showcaseHeight?: number;
	showcaseWidth?: number;
}

export function Wars(props: WarsProps) {
	const [gameName, setGameName] = useState("Super Mario 64");
	const [incentiveName, setIncentiveName] = useState("Incentive Name");
	const [options, setOptions] = useState([
		{ name: "Option 1", total: 100 },
		{ name: "Option 2", total: 200 },
	]);
	const [type, setType] = useState<War["type"]>("War");

	const ref = useRef<TickerItemHandles>(null);

	function handleRunAnimation() {
		if (!ref.current) return;

		const tl = gsap.timeline();
		ref.current.animation(tl);
		tl.play();
	}

	const war: War = {
		game: gameName,
		incentive: incentiveName,
		notes: "",
		active: true,
		index: 0,
		id: "test-war",
		options: options,
		type: type,
	};

	return (
		<div className={styles.container}>
			<h2>Wars</h2>
			<div
				className={clsx(styles.showcase, styles.fullWidth)}
				style={{
					backgroundColor: props.showcaseBackgroundColour,
					height: props.showcaseHeight,
					width: props.showcaseWidth,
				}}
			>
				<WarGame war={war} ref={ref} />
			</div>
			<div className={styles.controls}>
				<Button onClick={handleRunAnimation}>Run Animation</Button>
				<TextField
					label="Game"
					variant="outlined"
					value={gameName}
					onChange={(e) => setGameName(e.target.value)}
				/>
				<TextField
					label="Incentive Name"
					variant="outlined"
					value={incentiveName}
					onChange={(e) => setIncentiveName(e.target.value)}
				/>
				{options.map((option, index) => (
					<div key={index}>
						<TextField
							label={`Option ${index + 1} Name`}
							variant="outlined"
							value={option.name}
							onChange={(e) => {
								const newOptions = [...options];
								newOptions[index] = { ...newOptions[index]!, name: e.target.value };
								setOptions(newOptions);
							}}
						/>
						<NumberField
							label={`Option ${index + 1} Total`}
							value={option.total}
							onValueChange={(value) => {
								const newOptions = [...options];
								newOptions[index] = { ...newOptions[index]!, total: Number(value) };
								setOptions(newOptions);
							}}
						/>
					</div>
				))}

				<Stack direction="row" spacing={1}>
					<Button
						variant="outlined"
						onClick={() => setOptions([...options, { name: "New Option", total: 0 }])}
					>
						Add Option
					</Button>
					<Button
						variant="text"
						disabled={options.length === 0}
						onClick={() => {
							if (options.length > 0) {
								setOptions(options.slice(0, -1));
							}
						}}
					>
						Remove Last
					</Button>
				</Stack>
				<FormControl>
					<FormLabel id="type-label">Type</FormLabel>
					<RadioGroup
						row
						aria-labelledby="type-label"
						defaultValue="War"
						name="radio-buttons-group"
						value={type}
						onChange={(e) => setType(e.target.value as War["type"])}
					>
						<FormControlLabel value="War" control={<Radio />} label="War" />
						<FormControlLabel value="War-NoEdit" control={<Radio />} label="War-NoEdit" />
					</RadioGroup>
				</FormControl>
			</div>
		</div>
	);
}
