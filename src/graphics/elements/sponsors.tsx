import { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";

import type NodeCG from "nodecg/types";

const SponsorsContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

const SponsorImage = styled.img`
	object-position: center;
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

export function Sponsors(props: Props) {
	const [imgIndex, setImgIndex] = useState(props.start ?? 0);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		// Change this to a tl loop
		const interval = setInterval(() => {
			if (!imageRef.current || !props.sponsors || props.sponsors.length < 2) {
				return;
			}
			// Runs every 30 seconds
			const tl = gsap.timeline();
			tl.to(imageContainerRef.current, { duration: 1, opacity: 0 });
			tl.call(() => {
				if (props.sponsors) {
					if (imageRef.current && props.sponsors) {
						imageRef.current.src = props.sponsors[imgIndex]?.url ?? "";
					}
				}
			});
			tl.to(imageContainerRef.current, { duration: 1, opacity: 1 }, "+=0.5");
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
		<SponsorsContainer ref={imageContainerRef} className={props.className} style={props.style}>
			<SponsorImage ref={imageRef} src={props.sponsors[props.start ?? 0]?.url} />
		</SponsorsContainer>
	);
}

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
}
