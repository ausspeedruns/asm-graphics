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
import { ASM26Felt } from "./elements/asm26/asm26-felt";
import { TimeStyleProvider } from "./elements/time-style-context";
import { useIntermissionStore } from "./stores/intermission-store";
import { IntermissionCurrentRun } from "./intermission/current-run";
import { IntermissionDonationTotal } from "./intermission/donation-total";
import { BackgroundMusic } from "./intermission/background-music";
import { IntermissionHost } from "./intermission/host";
import { Location } from "./intermission/location";
import { Sponsors } from "./elements/sponsors";
import { ASM26NightMode, fireParticles } from "./elements/asm26/asm26-night-mode";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import { ParticlesProvider } from "@tsparticles/react";

const cameraLeft = 64;
const cameraTop = 80;
const cameraWidth = 1000;
const cameraHeight = 820;

const asm26IncentivesContainerWidth = 780;
const asm26IncentivesContainerHeight = 235;
const asm26OutlineWidth = 8;

const init = async (engine: Engine): Promise<void> => {
	await loadFull(engine);
};

function IntermissionPage() {
	return (
		<ParticlesProvider init={init}>
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
		</ParticlesProvider>
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
			<ASM26NightMode
				particlesId="intermission"
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					left: 0,
					top: 0,
					clipPath: "url(#cameraCutoutPath)",
				}}
			/>
			{/* <img src={IntermissionBG} style={{ position: "absolute", top: 0, left: 0 }} /> */}
			<div className={styles.main}>
				<ASM26Felt
					className={styles.asm26FeltCutout}
					particlesId="red"
					style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0 }}
					disableNightMode
				/>
				<div className={styles.leftColumn}>
					<div className={clsx(styles.asm26CameraBorder, styles.asm26Stitching)}>
						{/* <IntermissionVideoComponent ref={adsRef} videos={videos} /> */}
					</div>
					<div className={styles.cameraShadow} />
				</div>
				<div className={styles.rightColumn}>
					<span className={clsx(styles.asm26Border, styles.arrows, styles.orange)}>{"<><><><><><><><"}</span>
					<IntermissionDonationTotal />
					<span className={clsx(styles.asm26Border, styles.arrows, styles.blue)}>{"<><><><><><><><"}</span>
					<span className={clsx(styles.asm26Border, styles.plusses, styles.blue)}>+++++++++++++++++++++</span>
					<IntermissionCurrentRun />
					<span className={clsx(styles.asm26Border, styles.plusses, styles.orange)}>
						+++++++++++++++++++++
					</span>
					<div
						className={styles.incentivesContainer}
						style={{ width: asm26IncentivesContainerWidth, height: asm26IncentivesContainerHeight }}
						ref={incentivesRef}
					>
						<svg
							viewBox={`0 0 ${asm26IncentivesContainerWidth + 1 * asm26OutlineWidth} ${asm26IncentivesContainerHeight + 1 * asm26OutlineWidth}`}
							style={{
								width: asm26IncentivesContainerWidth + asm26OutlineWidth,
								height: asm26IncentivesContainerHeight + asm26OutlineWidth,
								top: -asm26OutlineWidth / 2,
								left: -asm26OutlineWidth / 2,
								position: "absolute",
								zIndex: 100,
								pointerEvents: "none",
							}}
						>
							<rect
								x={asm26OutlineWidth / 2}
								y={asm26OutlineWidth / 2}
								width={asm26IncentivesContainerWidth}
								height={asm26IncentivesContainerHeight}
								rx="20"
								ry="20"
								fill="none"
								stroke="#cc3622"
								strokeWidth={asm26OutlineWidth}
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeDasharray="30 20"
							/>
						</svg>
						<IntermissionIncentives />
					</div>
				</div>
			</div>
			<div className={styles.footer}>
				<ASM26Felt
					particlesId="blue"
					style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0 }}
					disableNightMode
				/>
				<Location />
				<BackgroundMusic volume={backgroundMusicVolume} />
				<IntermissionHost />
				<Sponsors sponsors={sponsors} style={{ maxHeight: 130, maxWidth: "300px", zIndex: 10 }} />
				<GoCLogo />
			</div>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<IntermissionPage />);
