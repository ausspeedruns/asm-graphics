import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
// import { Lottie, type LottieHandle } from "lottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react/webgpu";

import styles from "./transition.module.css";

import lottieAnimation from "./media/Transition.slots.json?url";

import Clip1 from "./media/audio/chestappears1.mp3";
import Clip2 from "./media/audio/crystal.mp3";
import Clip3 from "./media/audio/heartcontainer1.mp3";
import Clip4 from "./media/audio/heartpiece1.mp3";
import Clip5 from "./media/audio/itemget1.mp3";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";

const CLIPS: string[] = [Clip1, Clip2, Clip3, Clip4, Clip5];

function runString(runData: RunDataActiveRun | undefined) {
	if (!runData) return ["Enjoy the run!"];

	const allRunners = runData.teams.flatMap((team) => team.players.map((player) => player.name));

	return [runData.game ?? "???", runData.category ?? "???", new Intl.ListFormat().format(allRunners)];
}

const TAGLINES = [
	["Hi Mum!"],
	["Hi Dad!"],
	["Spedrn"],
	["I hope we're on time"],
	["What a great run!"],
	// ["Daily reminder", "Speedrun is one word"],
	// ["Backwards Long Jumps are real!", "Try it!"],
	["Now watch tech do the swap over speedrun!"],
	// ["ausrunsGGshake", "ausrunsGGshake"],
	["Has someone checked in on tech yet?"],
	["crowd jumpscare"],
	["Is Tasmania still attached to the logo?"],
	["ACE still trying to be discovered in AusSpeedruns graphics"],
	// ["It would suck if we were behind schedule", "Which we aren't... right?"],
	// ["GAME NAME", "By RUNNER NAME"],
	// ["By RUNNER NAME", "GAME NAME ...wait hang on"],
];

export function Transition() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const dotLottieRef = useRef<DotLottie>(null);
	const [gpu, setGpu] = useState<GPUDevice>();

	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [automationsRep] = useReplicant("automations");

	useEffect(() => {
		let created: GPUDevice | undefined;

		navigator.gpu
			?.requestAdapter()
			.then((adapter) => adapter?.requestDevice())
			.then((gpuDevice) => {
				created = gpuDevice;
				setGpu(created);
			});

		return () => created?.destroy();
	}, []);

	useListenFor("transition:UNKNOWN", () => {
		console.log("Transitioning");
		runTransition("basic");
	});

	useListenFor("transition:toIRL", () => {
		console.log("Transitioning");
		runTransition("basic", runString(runDataActiveRep));
	});

	useListenFor("transition:toGame", () => {
		console.log("Transitioning to Game");
		runTransition("toGame", runString(runDataActiveRep));
	});

	useListenFor("transition:toIntermission", () => {
		console.log("Transitioning to Intermission");
		runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);
		// runTransition("toIntermission");
	});

	function gsapPlaySound(audioRef: React.RefObject<HTMLAudioElement | null>, tl: gsap.core.Timeline, label: string) {
		tl.call(
			() => {
				if (!audioRef.current) return;
				audioRef.current.currentTime = 0;
				void audioRef.current.play();
			},
			[],
			label,
		);
	}

	function runTransition(transition: "toIntermission" | "toGame" | "basic", specialText: string[] = []) {
		dotLottieRef.current?.setTextSlot("gameName", { t: specialText[0] ?? "" });
		dotLottieRef.current?.setTextSlot("runner", { t: specialText[2] ?? "" });

		switch (transition) {
			case "basic":
				dotLottieRef.current?.setTextSlot("gameName", { t: "ASAP2026" });
				dotLottieRef.current?.setTextSlot("category", { t: "" });
				dotLottieRef.current?.setTextSlot("runner", { t: specialText[0] ?? "" });
				break;
			case "toIntermission":
				dotLottieRef.current?.setTextSlot("gameName", { t: "ASAP2026" });
				dotLottieRef.current?.setTextSlot("category", { t: specialText[0] ?? "" });
				dotLottieRef.current?.setTextSlot("runner", { t: specialText[0] ?? "" });
				break;
			case "toGame":
			default:
				dotLottieRef.current?.setTextSlot("gameName", { t: specialText[0] ?? "" });
				dotLottieRef.current?.setTextSlot("category", { t: specialText[1] ?? "" });
				dotLottieRef.current?.setTextSlot("runner", { t: specialText[2] ?? "" });
				break;
		}

		const tl = gsap.timeline();

		tl.call(() => {
			dotLottieRef.current?.setFrame(0);
			dotLottieRef.current?.play();
			// console.log(CLIPS[Math.floor(Math.random() * CLIPS.length)]);
			if (audioRef.current) {
				audioRef.current.src = CLIPS[Math.floor(Math.random() * CLIPS.length)] ?? "";
			}
		});
		gsapPlaySound(audioRef, tl, "+=1.5");
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<div className={styles.transitionRoot}>
			<div className={styles.transitionDiv}>
				<DotLottieReact
					src={lottieAnimation}
					loop={false}
					dotLottieRefCallback={(dotLottie) => {
						dotLottieRef.current = dotLottie;
					}}
					device={gpu}
				/>
			</div>

			<audio ref={audioRef} />
			<button style={{ float: "right" }} onClick={() => runTransition("basic")}>
				Run blank transition
			</button>
			<button style={{ float: "right" }} onClick={() => runTransition("toGame", runString(runDataActiveRep))}>
				Run game transition
			</button>
			<button
				style={{ float: "right" }}
				onClick={() => runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)])}
				// onClick={() => runTransition("toIntermission")}
			>
				Run intermission transition
			</button>
			<div>
				<button onClick={() => changeBGColor("#000")}>Black</button>
				<button onClick={() => changeBGColor("#f00")}>Red</button>
				<button onClick={() => changeBGColor("#0f0")}>Green</button>
				<button onClick={() => changeBGColor("#00f")}>Blue</button>
				<button onClick={() => changeBGColor("rgba(0, 0, 0, 0)")}>Transparent</button>
			</div>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(<Transition />);
