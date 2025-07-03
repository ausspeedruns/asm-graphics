import React, { useEffect, useState, useRef, forwardRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

import type NodeCG from "nodecg/types";

const SponsorsContainer = styled.img`
	object-fit: contain;
	z-index: 3;
	height: 100%;
	width: 100%;
`;

interface Props {
	sponsors?: NodeCG.AssetFile[];
	start?: number;
	style?: React.CSSProperties;
	className?: string;
}

const AD_LENGTH = 5;

export const Sponsors: React.FC<Props> = (props: Props) => {
	const [imgIndex, setImgIndex] = useState(props.start ?? 0);
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		// Change this to a tl loop
		const interval = setInterval(() => {
			if (!imageRef.current || !props.sponsors || props.sponsors.length < 2) {
				return;
			}
			// Runs every 30 seconds
			const tl = gsap.timeline();
			tl.to(imageRef.current, { duration: 1, opacity: 0 });
			tl.call(() => {
				if (imageRef.current && props.sponsors) {
					imageRef.current.src = props.sponsors[imgIndex]?.url;
				}
			});
			tl.to(imageRef.current, { duration: 1, opacity: 1 }, "+=0.5");
			tl.call(() => {
				if (!props.sponsors) return;
				setImgIndex(imgIndex + 1 >= props.sponsors.length ? 0 : imgIndex + 1);
			});
		}, 1000 * AD_LENGTH);
		return () => clearInterval(interval);
	}, [imgIndex, props.sponsors]);

	if (!props.sponsors || props.sponsors.length === 0) {
		return <></>;
	}

	return (
		<SponsorsContainer
			ref={imageRef}
			className={props.className}
			style={props.style}
			src={props.sponsors[props.start ?? 0].url}
		/>
	);
};

const SponsorsBoxContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

interface FullBoxProps {
	sponsors: NodeCG.AssetFile[];
	style?: React.CSSProperties;
	className?: string;
	sponsorStyle?: React.CSSProperties;
}

export function SponsorsBox(props: FullBoxProps) {
	const sponsorMainRef = useRef<HTMLDivElement>(null);

	return (
		<SponsorsBoxContainer className={props.className} style={props.style}>
			<div ref={sponsorMainRef} style={props.sponsorStyle}>
				<Sponsors sponsors={props.sponsors} />
			</div>
		</SponsorsBoxContainer>
	);
};

SponsorsBox.displayName = "SponsorsBox";
