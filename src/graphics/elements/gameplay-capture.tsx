import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./gameplay-capture.module.css";

const TEST_MODE = false;

function getAspectRatio(aspectRatio: `${number}:${number}`) {
	const [width, height] = aspectRatio.split(":").map(Number);
	return width! / height!;
}

function getAspectRatioDifference(width: number, height: number, aspectRatio: `${number}:${number}`) {
	const expectedWidth = Math.round(height * getAspectRatio(aspectRatio));
	const horizontalDifference = width - expectedWidth;

	if (horizontalDifference === 0) {
		return `Exact at this pixel size for ${aspectRatio}`;
	}

	return `${Math.abs(horizontalDifference)} px ${horizontalDifference < 0 ? "narrower" : "wider"} horizontally than ${aspectRatio}`;
}

interface GameplayCaptureProps {
	aspectRatio: `${number}:${number}`;
	grow?: boolean;
}

export function GameplayCapture(props: GameplayCaptureProps) {
	const captureRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!TEST_MODE || !captureRef.current) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;

			setSize({
				width: Math.round(entry.contentRect.width),
				height: Math.round(entry.contentRect.height),
			});
		});

		observer.observe(captureRef.current);
		return () => observer.disconnect();
	}, []);

	if (TEST_MODE) {
		return (
			<div
				ref={captureRef}
				className={clsx(styles.capture, props.grow && styles.grow, styles.testMode)}
				style={{ aspectRatio: getAspectRatio(props.aspectRatio) }}
			>
				{size.width > 0 && size.height > 0 ? (
					<div className={styles.measurementDetails}>
						<div>
							Actual: {size.width} x {size.height} ({(size.width / size.height).toFixed(6)}:1)
						</div>
						<div>Approx: {props.aspectRatio}</div>
						<div>{getAspectRatioDifference(size.width, size.height, props.aspectRatio)}</div>
					</div>
				) : (
					"Measuring..."
				)}
			</div>
		);
	}

	return (
		<div
			ref={captureRef}
			className={clsx(styles.capture, props.grow && styles.grow)}
			style={{ aspectRatio: getAspectRatio(props.aspectRatio) }}
		/>
	);
}
