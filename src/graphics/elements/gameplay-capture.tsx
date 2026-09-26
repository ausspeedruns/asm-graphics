import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const TEST_MODE = true;

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
	const captureStyle: CSSProperties = {
		flex: props.grow ? "1 1 auto" : "0 1 auto",
		minWidth: 0,
		minHeight: 0,
		maxWidth: "100%",
		maxHeight: "100%",
		...(props.grow ? { alignSelf: "center" } : {}),
		aspectRatio: getAspectRatio(props.aspectRatio),
	};

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
				style={{
					...captureStyle,
					backgroundColor: "red",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "white",
					textAlign: "center",
				}}
			>
				{size.width > 0 && size.height > 0 ? (
					<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
		<div ref={captureRef} style={captureStyle} />
	);
}
