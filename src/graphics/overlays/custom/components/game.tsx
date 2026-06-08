import { useNode } from "@craftjs/core";
import NumberField from "../../../elements/number-field";
import { useEditorDevStore } from "../../../stores/editor-dev-store";
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

interface GameProps {
	aspectRatioWidth: number;
	aspectRatioHeight: number;
}

export function Game(props: GameProps) {
	const devMode = useEditorDevStore((state) => state.devMode);
	const {
		connectors: { connect, drag },
	} = useNode();
	const realGameRef = useRef<HTMLDivElement>(null);
	const [debugText, setDebugText] = useState("");

	useEffect(() => {
		if (!realGameRef.current || !devMode) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			const { width, height } = entry?.contentRect || {};
			const rawSizeText = `Size: ${width?.toFixed(0)} x ${height?.toFixed(0)}`;
			const aspectRatio = width && height ? getAspectRatio(width, height) : "N/A";
			const approximateRatio = width && height ? getApproximateRatio(width, height) : "N/A";
			setDebugText(`${rawSizeText}\n(Aspect Ratio: ${aspectRatio} | Approximate: ${approximateRatio})`);
		});

		observer.observe(realGameRef.current);

		return () => {
			observer.disconnect();
		};
	}, [devMode]);

	const ratio = props.aspectRatioWidth / props.aspectRatioHeight;

	return (
		<div
			style={{
				height: "100%",
				width: "auto",
				minWidth: 0,
				minHeight: 0,
				maxWidth: "100%",
				aspectRatio: `${props.aspectRatioWidth} / ${props.aspectRatioHeight}`,
				flex: "0 1 auto",
				display: "grid",
				placeItems: "center",
				containerType: "size",
				overflow: "hidden",
				backgroundColor: devMode ? "#0000ffaa" : undefined,
			}}
		>
			<div
				style={{
					width: `min(100cqw, calc(100cqh * ${ratio}))`,
					height: `min(100cqh, calc(100cqw / ${ratio}))`,
					backgroundColor: devMode ? "#ff0000" : undefined,
					color: "white",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				ref={(ref) => {
					if (ref) {
						connect(drag(ref));
						realGameRef.current = ref;
					}
				}}
			>
				{devMode && <div>{debugText}</div>}
			</div>
		</div>
	);
}

function GameSettings() {
	const {
		actions: { setProp },
		aspectRatioWidth,
		aspectRatioHeight,
	} = useNode((node) => ({
		aspectRatioWidth: node.data.props["aspectRatioWidth"],
		aspectRatioHeight: node.data.props["aspectRatioHeight"],
	}));

	return (
		<div>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Aspect Ratio Width</Typography>

				<NumberField
					size="small"
					value={aspectRatioWidth}
					onValueChange={(value) => setProp((props) => (props.aspectRatioWidth = value))}
				/>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant="caption">Aspect Ratio Height</Typography>

				<NumberField
					size="small"
					value={aspectRatioHeight}
					onValueChange={(value) => setProp((props) => (props.aspectRatioHeight = value))}
				/>
			</Box>
		</div>
	);
}

Game.craft = {
	displayName: "Game",
	props: {
		aspectRatioWidth: 1,
		aspectRatioHeight: 1,
	},
	related: {
		settings: GameSettings,
	},
};

function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b);
}

function getAspectRatio(width: number, height: number): string {
	// Round to avoid issues with subpixel values
	const w = Math.round(width);
	const h = Math.round(height);

	const divisor = gcd(w, h);

	return `${w / divisor}:${h / divisor}`;
}

function getApproximateRatio(width: number, height: number): string {
	const decimal = width / height;
	const commonRatios = [
		{ ratio: 16 / 9, label: "16:9" },
		{ ratio: 4 / 3, label: "4:3" },
		{ ratio: 1 / 1, label: "1:1" },
		{ ratio: 16 / 10, label: "16:10" },
		{ ratio: 21 / 9, label: "21:9" },
		{ ratio: 9 / 16, label: "9:16" },
	];

	let closest = commonRatios[0] ?? { ratio: decimal, label: `${width.toFixed(0)}:${height.toFixed(0)}` };
	let minDiff = Math.abs(decimal - closest.ratio);

	for (const item of commonRatios) {
		const diff = Math.abs(decimal - item.ratio);
		if (diff < minDiff) {
			minDiff = diff;
			closest = item;
		}
	}

	// If the difference is too large, fallback to exact GCD
	if (minDiff > 0.05) {
		return getAspectRatio(width, height);
	}

	return closest.label;
}
