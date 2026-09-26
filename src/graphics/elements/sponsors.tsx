import { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";

import type NodeCG from "nodecg/types";

const SponsorsContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

const SponsorTestOverlay = styled.div`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	border: 2px dashed var(--sec);
	background: rgb(0 0 0 / 35%);
	color: var(--sec);
	font-family: var(--game-font, sans-serif);
	font-size: 20px;
	text-align: center;
	pointer-events: none;
	z-index: 4;
`;

const SponsorImage = styled.img`
	object-position: center;
	object-fit: contain;
	z-index: 3;
	height: 100%;
	width: 100%;
`;

const TEST_MODE = true;

interface Props {
	sponsors?: NodeCG.AssetFile[];
	start?: number;
	width?: React.CSSProperties["width"];
	height?: React.CSSProperties["height"];
	style?: React.CSSProperties;
	className?: string;
}

const AD_LENGTH = 60;

function formatDimension(value: React.CSSProperties["width"] | undefined) {
	if (value === undefined) return "auto";
	return typeof value === "number" ? `${value}px` : value;
}

export function Sponsors(props: Props) {
	const [imgIndex, setImgIndex] = useState(props.start ?? 0);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const imageStyle: React.CSSProperties = { ...props.style };
	if (props.width !== undefined) imageStyle.width = props.width;
	if (props.height !== undefined) imageStyle.height = props.height;

	const width = props.width ?? props.style?.width;
	const height = props.height ?? props.style?.height;

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

	if ((!props.sponsors || props.sponsors.length === 0) && !TEST_MODE) {
		return <></>;
	}

	return (
		<SponsorsContainer ref={imageContainerRef} className={props.className} style={imageStyle}>
			{props.sponsors && props.sponsors.length > 0 && (
				<SponsorImage ref={imageRef} src={props.sponsors[props.start ?? 0]?.url} />
			)}
			{TEST_MODE && (
				<SponsorTestOverlay>
					Sponsor area
					<br />
					{formatDimension(width)} x {formatDimension(height)}
				</SponsorTestOverlay>
			)}
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
	sponsors?: NodeCG.AssetFile[];
	width: NonNullable<React.CSSProperties["width"]>;
	height: NonNullable<React.CSSProperties["height"]>;
	style?: React.CSSProperties;
	className?: string;
}

export function SponsorsBox(props: FullBoxProps) {
	const boxStyle: React.CSSProperties = {
		...props.style,
		width: props.width,
		height: props.height,
	};

	return (
		<SponsorsBoxContainer className={props.className} style={boxStyle}>
			<Sponsors
				sponsors={props.sponsors}
				width={props.width}
				height={props.height}
			/>
		</SponsorsBoxContainer>
	);
}
