import { useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";

import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo.js";
import styles from "./video.module.css";

interface Props {
	className?: string;
	style?: React.CSSProperties;
	ref?: React.Ref<IntermissionAdsRef>;
	videos?: IntermissionVideo[];
}

export interface IntermissionAdsRef {
	showVideo: (video: IntermissionVideo) => void;
}

export function IntermissionVideoComponent(props: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const [videoRunning, setVideoRunning] = useState(false);

	useImperativeHandle(props.ref, () => ({
		showVideo(video) {
			if (videoRunning || !video.videoInfo) return;

			setVideoRunning(true);

			console.log("Showing video:", video);

			const tl = gsap.timeline();

			// Prepare video contents
			tl.call(() => {
				if (!videoRef.current) return;
				videoRef.current.volume = video.volume;
				videoRef.current.src = video.asset;
			});

			// Run entry
			// tl.call(() => {
			// 	if (!entryRef.current) return;
			// 	entryRef.current?.play();
			// });
			tl.to(containerRef.current, {
				opacity: 1,
			});

			// // Prepare entry vid
			// tl.set(entryRef.current, { opacity: 1 });

			// Wait for entry finish and then fade ad in
			tl.to([videoRef.current, textRef.current], { opacity: 1, duration: 1 });

			// Run ad
			tl.call(() => {
				if (!videoRef.current) return;
				void videoRef.current.play();
			});

			// Fade out ad
			tl.to(
				[videoRef.current, textRef.current],
				{ opacity: 0, duration: 1 },
				`+=${video.videoInfo.duration + 1}`,
			);

			// Swap from entry to exit
			// tl.set(entryRef.current, { opacity: 0 });
			// tl.set(exitRef.current, { opacity: 1 });
			tl.to(containerRef.current, {
				opacity: 0,
			});

			// Run exit
			// tl.call(() => {
			// 	if (!exitRef.current) return;
			// 	exitRef.current?.play();
			// });

			// tl.set(exitRef.current, { opacity: 0 });
			tl.call(() => setVideoRunning(false));
		},
	}));

	return (
		<div className={clsx(styles.intermissionAdsContainer, props.className)} style={props.style} ref={containerRef}>
			{/* <EntryExitVids ref={entryRef} src={adEntry} muted /> */}
			<div className={styles.videoBox}>
				<video className={styles.video} ref={videoRef} />
			</div>
			{/* <EntryExitVids ref={exitRef} src={adExit} muted /> */}
			{/* <div
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
			</div> */}
		</div>
	);
}
