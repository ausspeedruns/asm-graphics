import { Button, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Headset } from "../../../shared/audio-data";
import { Add, Remove } from "@mui/icons-material";
import styles from "./audio-fader.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	label?: string;
	channel: number;
	mixBus: number;
	value: number | undefined;
	onChange: (value: number) => void;
	colour?: string;
	headset?: Headset;
	fakeDisabled?: boolean;
}

export const AudioFader = (props: Props) => {
	const [faderVal, setFaderVal] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (typeof props.value !== "undefined") {
			setFaderVal(props.value);
		}
	}, [props.value]);

	return (
		<div
			className={clsx(styles.audioFaderContainer, props.className)}
			style={{ opacity: props.fakeDisabled ? 0.4 : 1, ...props.style }}
		>
			{props.label && (
				<div
					className={styles.faderLabel}
					style={{
						fontStyle: props.label === "You" ? "italic" : "initial",
						fontWeight: props.label === "You" ? "bold" : "initial",
					}}
				>
					{props.label}
				</div>
			)}
			<div className={styles.sliderContainer}>
				<Slider
					className={styles.styledSlider}
					style={{ margin: "auto" }}
					value={faderVal ?? 0}
					onChange={(_, newVal) => {
						if (!Array.isArray(newVal)) {
							setFaderVal(newVal);
							props.onChange(newVal);
						}
					}}
					min={0}
					max={1}
					step={0.001}
					// marks={marks}
					sx={{
						"& .MuiSlider-track": {
							background: props.colour,
						},
					}}
				/>
				<Button
					variant="outlined"
					onClick={() => {
						const newValue = Math.min((faderVal ?? 0) - 0.05, 1);
						setFaderVal(newValue);
						props.onChange(newValue);
					}}
					style={{ marginLeft: 20 }}
				>
					<Remove />
				</Button>
				<Button
					variant="outlined"
					onClick={() => {
						const newValue = Math.min((faderVal ?? 0) + 0.05, 1);
						setFaderVal(newValue);
						props.onChange(newValue);
					}}
				>
					<Add />
				</Button>
				<p className={styles.dbValue}>{((faderVal ?? 0) * 100).toFixed(0)}</p>
			</div>
		</div>
	);
};
