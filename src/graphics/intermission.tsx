import { useState, useEffect, useRef, useImperativeHandle, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import _ from "underscore";
import styles from "./intermission.module.css";
import clsx from "clsx";

import { IntermissionIncentives } from "./intermission/incentives";

// Assets
import { IntermissionVideoComponent, type IntermissionAdsRef } from "./intermission/video";
import GoCLogo from "./media/game-on-cancer/full-logo.svg?react";

// import IntermissionBG from "./overlays/backgrounds/Intermission.png";

// import AusSpeedrunsLogo from './media/AusSpeedruns-Logo.svg';
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo";
import { TimeStyleProvider } from "./elements/time-style-context";
import { useIntermissionStore } from "./stores/intermission-store";
import { IntermissionCurrentRun } from "./intermission/current-run";
import { IntermissionDonationTotal } from "./intermission/donation-total";
import { BackgroundMusic } from "./intermission/background-music";
import { IntermissionHost } from "./intermission/host";
import { Location } from "./intermission/location";
import { Sponsors } from "./elements/sponsors";

const cameraLeft = 64;
const cameraTop = 80;
const cameraWidth = 1000;
const cameraHeight = 820;

function IntermissionPage() {
	return (
		<TimeStyleProvider>
			<Intermission />
			<input
				type="range"
				min="0"
				max="1"
				step="0.001"
				// value={normalisedTime}
				style={{ width: "100%" }}
				// onChange={(e) => setNormalisedTime(parseFloat(e.target.value))}
			/>
			<div>
				{/* <button onClick={() => setNormalisedTime(0)}>Midday</button>
				<button onClick={() => setNormalisedTime((sunsetStart + sunsetEnd) / 2)}>Sunset</button>
				<button onClick={() => setNormalisedTime(0.5)}>Night</button>
				<button onClick={() => setNormalisedTime((sunriseStart + sunriseEnd) / 2)}>Sunrise</button> */}
			</div>
		</TimeStyleProvider>
	);
}

export function Intermission() {
	const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(1);

	const sponsors = useIntermissionStore((state) => state.sponsors);
	const videos = useIntermissionStore((state) => state.videos);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const incentivesRef = useRef<HTMLDivElement>(null);

	function showVideo(video: IntermissionVideo) {
		if (!video.videoInfo) return;

		const tl = gsap.timeline();

		tl.set({ value: 1 }, { value: 1, onUpdate: setBackgroundMusicVolume, onUpdateParams: ["value"] });

		tl.fromTo(
			{ value: 1 },
			{ value: 0 },
			{
				duration: 5,
				onUpdate: setBackgroundMusicVolume,
				onUpdateParams: ["value"],
			},
		);

		tl.call(() => adsRef.current?.showVideo(video));

		tl.to(
			{ value: 0 },
			{
				value: 1,
				duration: 5,
				onUpdate: setBackgroundMusicVolume,
				onUpdateParams: ["value"],
			},
			`+=${video.videoInfo.duration + 10}`,
		);
	}

	useListenFor("intermission-videos:play", (newVal) => {
		const foundVideo = videos?.find((video) => video.asset === newVal);
		if (!foundVideo) return;

		showVideo(foundVideo);
	});

	return (
		<div className={styles.intermission}>
			<svg className={styles.cameraCutout} viewBox="0 0 1920 1080">
				<clipPath id="cameraCutoutPath">
					<path
						d={`M 0 0 H 1920 V 1080 H 0 Z M ${cameraLeft} ${cameraTop} V ${cameraTop + cameraHeight} H ${cameraLeft + cameraWidth} V ${cameraTop} H ${cameraLeft} Z`}
						fillRule="evenodd"
					/>
				</clipPath>
			</svg>
			<div className={clsx(styles.asm26WholeStitching, styles.asm26Stitching)} />
			<div className={styles.main}>
				<div className={styles.leftColumn}>
					{/* <IntermissionVideoComponent ref={adsRef} videos={videos} /> */}
					<div className={styles.cameraShadow} />
				</div>
				<div className={styles.rightColumn}>
					<IntermissionDonationTotal />
					<IntermissionCurrentRun />
					<div className={styles.incentivesContainer} ref={incentivesRef}>
						<IntermissionIncentives />
					</div>
				</div>
			</div>
			<div className={styles.footer}>
				<Location />
				<BackgroundMusic volume={1} />
				<IntermissionHost />
				<Sponsors sponsors={sponsors} style={{ maxHeight: 130, maxWidth: "300px", zIndex: 10 }} />
				<GoCLogo />
			</div>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<IntermissionPage />);
