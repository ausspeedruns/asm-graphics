import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

// import adEntry from "../../media/ASM23/ad_ENTRY.webm";
// import adExit from "../../media/ASM23/ad_EXIT.webm";

const IntermissionAdsContainer = styled.div`
	width: 722px;
	/* opacity: 0; */
	/* background: linear-gradient(90deg, #7f6314 0%, #000000 33.33%, #000000 66.67%, #7f6314 100%); */
	/* border-top: 1px solid var(--sec);
	border-bottom: 1px solid var(--sec); */
	height: 406px;
	position: absolute;
	top: 0;
	right: 96px;
`;

const VideoBox = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 0;
	width: 100%;
	height: 100%;
	/* background: red; */
`;

const Video = styled.video`
	width: 100%;
	height: auto;
	z-index: 2;
	opacity: 0;
`;

// const EntryExitVids = styled.video`
// 	opacity: 0;
// 	position: absolute;
// `;

interface Props {
	className?: string;
	style?: React.CSSProperties;
}

export interface IntermissionAdsRef {
	showAd: (ad: string) => void;
}

export const IntermissionAds = forwardRef<IntermissionAdsRef, Props>((props, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	// const entryRef = useRef<HTMLVideoElement>(null);
	// const exitRef = useRef<HTMLVideoElement>(null);

	useImperativeHandle(ref, () => ({
		showAd(ad) {
			let adData = {
				src: "",
				length: 0,
				volume: 0,
			};

			switch (ad) {
				case "GOC":
					adData = {
						src: "../shared/sponsors/GameOnCancer.mp4",
						length: 36,
						volume: 1,
					};
					break;
				default:
					return;
			}

			if (adData.src === "") return;

			const tl = gsap.timeline();

			// Prepare ad contents
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current.volume = adData.volume;
				videoRef.current.src = adData.src;
			});

			// Run entry
			// tl.call(() => {
			// 	if (!entryRef.current) return;
			// 	entryRef.current?.play();
			// });

			// // Prepare entry vid
			// tl.set(entryRef.current, { opacity: 1 });

			// Wait for entry finish and then fade ad in
			tl.to([videoRef.current, textRef.current], { opacity: 1, duration: 1 });

			// Run ad
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current.play();
			});

			// Fade out ad
			tl.to([videoRef.current, textRef.current], { opacity: 0, duration: 1 }, `+=${adData.length + 1}`);

			// Swap from entry to exit
			// tl.set(entryRef.current, { opacity: 0 });
			// tl.set(exitRef.current, { opacity: 1 });

			// Run exit
			// tl.call(() => {
			// 	if (!exitRef.current) return;
			// 	exitRef.current?.play();
			// });

			// tl.set(exitRef.current, { opacity: 0 });
		},
	}));

	return (
		<IntermissionAdsContainer className={props.className} style={props.style} ref={containerRef}>
			{/* <EntryExitVids ref={entryRef} src={adEntry} muted /> */}
			<VideoBox>
				<Video ref={videoRef} />
			</VideoBox>
			{/* <EntryExitVids ref={exitRef} src={adExit} muted /> */}
			<div
				ref={textRef}
				style={{
					fontFamily: "var(--main-font)",
					fontSize: 70,
					height: 55,
					textAlign: "center",
					position: "absolute",
					width: 554,
					right: -95,
					top: 413,
					opacity: 0,
				}}>
				Game On Cancer
			</div>
		</IntermissionAdsContainer>
	);
});

IntermissionAds.displayName = "IntermissionAds";
