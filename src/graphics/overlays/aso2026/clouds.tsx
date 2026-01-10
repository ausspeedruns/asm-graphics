// ASO2026

import { useRef, useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import Clouds1 from "./clouds-1.png";
// import Clouds2 from "./clouds-2.png";

const SPEED = 5; // pixels per second

// Add more cloud configurations here
const CLOUDS = [
	{ src: Clouds1, minGap: 100, maxGap: 400 },
	// { src: Clouds2, minGap: 50, maxGap: 150 },
];

const CloudContainer = styled.div`
	position: relative;
	width: 100%;
	height: auto;
	overflow: hidden;
`;

const CloudImg = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	will-change: transform;
	pointer-events: none;
	user-select: none;
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
`;

function CloudLayer({ src, minGap, maxGap }: (typeof CLOUDS)[number]) {
	const [cloudWidth, setCloudWidth] = useState(0);
	const img1Ref = useRef<HTMLImageElement>(null);
	const img2Ref = useRef<HTMLImageElement>(null);
	const animRef = useRef<number>(null);
	
	// Use refs for animation state to avoid re-renders
	const xRef = useRef(0);
	const gapRef = useRef(minGap);

	const handleImageLoad = useCallback(() => {
		if (img1Ref.current && img1Ref.current.naturalWidth > 0) {
			setCloudWidth(img1Ref.current.naturalWidth);
		}
	}, []);

	useEffect(() => {
		if (cloudWidth === 0) return;

		let lastTime = performance.now();

		function animate(now: number) {
			const dt = (now - lastTime) / 1000;
			lastTime = now;
			
			// Update position using ref (no re-render)
			xRef.current += SPEED * dt;
			
			// Check for wrap-around
			if (xRef.current <= -(cloudWidth + gapRef.current)) {
				gapRef.current = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
				xRef.current = 0;
			}
			
			// Directly update DOM transforms (GPU accelerated, subpixel rendering)
			if (img1Ref.current) {
				img1Ref.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
			}
			if (img2Ref.current) {
				img2Ref.current.style.transform = `translate3d(${xRef.current + cloudWidth + gapRef.current}px, 0, 0)`;
			}
			
			animRef.current = requestAnimationFrame(animate);
		}
		
		animRef.current = requestAnimationFrame(animate);
		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
		};
	}, [cloudWidth, minGap, maxGap]);

	return (
		<>
			<CloudImg
				ref={img1Ref}
				src={src}
				alt="Clouds"
				draggable={false}
				onLoad={handleImageLoad}
			/>
			{cloudWidth > 0 && (
				<CloudImg
					ref={img2Ref}
					src={src}
					alt="Clouds"
					draggable={false}
				/>
			)}
		</>
	);
}

export function CloudScrolling({ style }: { style?: React.CSSProperties }) {
	return (
		<CloudContainer style={style}>
			{CLOUDS.map((cloud, idx) => (
				<CloudLayer key={idx} {...cloud} />
			))}
		</CloudContainer>
	);
}
