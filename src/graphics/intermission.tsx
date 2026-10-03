import { useState, useEffect, useRef, useImperativeHandle, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import _ from "underscore";
import styles from "./intermission.module.css";
import clsx from "clsx";

import { IntermissionIncentives } from "./intermission/incentives.js";

// Assets
import { IntermissionVideoComponent, type IntermissionAdsRef } from "./intermission/video.js";
import GoCLogo from "./media/game-on-cancer/full-logo.svg?react";

import crowdCam from "./media/asap26/Crowd Cam.png";

// import AusSpeedrunsLogo from './media/AusSpeedruns-Logo.svg';
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo.js";
import { TimeStyleProvider } from "./elements/time-style-context.js";
import { useIntermissionStore } from "./stores/intermission-store.js";
import { IntermissionCurrentRun } from "./intermission/current-run.js";
import { IntermissionDonationTotal } from "./intermission/donation-total.js";
import { BackgroundMusic } from "./intermission/background-music.js";
import { IntermissionHost } from "./intermission/host.js";
import { Location } from "./intermission/location.js";
import { Sponsors } from "./elements/sponsors.js";

import asap26Filigree from "./media/asap26/filigree.png";

const cameraLeft = 951;
const cameraTop = 50;
const cameraWidth = 915;
const cameraHeight = 800;

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
			<div className={styles.intermissionFrame}>
				<div className={styles.main}>
					<div className={styles.contentColumn}>
						<IntermissionDonationTotal />
						<IntermissionCurrentRun />
						<div className={styles.incentivesContainer} ref={incentivesRef}>
							<IntermissionIncentives />
						</div>
						<GoCLogo className={styles.charityLogo} />
					</div>
					<div className={styles.cameraColumn}>
						{/* <IntermissionVideoComponent ref={adsRef} videos={videos} /> */}
						{/* <div className={styles.cameraShadow} /> */}
						<div className={styles.footer}>
							<img src={asap26Filigree} style={{ position: "absolute", top: 0, left: 0 }} />
							<img
								src={asap26Filigree}
								style={{ position: "absolute", top: 0, right: 0, transform: "scaleX(-1)" }}
							/>
							<Location />
							<BackgroundMusic volume={1} />
							<IntermissionHost />
							<Sponsors sponsors={sponsors} style={{ maxHeight: 130, maxWidth: "300px", zIndex: 10 }} />
						</div>
					</div>
				</div>
			</div>
			<img src={crowdCam} style={{ position: "absolute", zIndex: 5, top: 43, left: 930 }} />
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<IntermissionPage />);
