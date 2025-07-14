import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import { useRive } from "@rive-app/react-canvas";

// import ASMLogo from './media/ASM2022 Logo.svg';
// import BGIMG from './media/pixel/Transition/BG.png';
// import StartWipeIMG from './media/pixel/Transition/StartWipe.png';
// import EndWipeIMG from './media/pixel/Transition/EndWipe.png';

// import TransitionStatic from "./overlays/backgrounds/TransitionStatic.png";

import Clip1 from "./media/audio/chestappears1.mp3";
import Clip2 from "./media/audio/crystal.mp3";
import Clip3 from "./media/audio/heartcontainer1.mp3";
import Clip4 from "./media/audio/heartpiece1.mp3";
import Clip5 from "./media/audio/itemget1.mp3";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Automations } from "@asm-graphics/types/Automations";

const ClipArray = [Clip1, Clip2, Clip3, Clip4, Clip5];

const TransitionContainer = styled.div`
	width: 1920px;
`;

const TransitionDiv = styled.div`
	height: 1080px;
	width: 1920px;
	overflow: hidden;
	border-right: 5px solid black;
	border-bottom: 5px solid black;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: relative;

	background-size: cover;
	background-position: center;
	image-rendering: pixelated;

	color: white;
	font-family: "Noto Sans";

	& div {
		position: absolute;
	}
`;

const BasicTransition = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;

	opacity: 0;
`;

function runString(runData: RunDataActiveRun | undefined) {
	if (!runData) return ["Enjoy the run!"];

	const allRunners = runData.teams.flatMap((team) => team.players.map((player) => player.name));

	return [runData.game ?? "???", runData.category ?? "???", `By ${new Intl.ListFormat().format(allRunners)}`];
}

const TAGLINES = [
	["Hi Mum!"],
	["Hi Dad!"],
	["Spedrn"],
	["I hope we're on time"],
	["What a great run!"],
	["Daily reminder", "Speedrun is one word"],
	["Backwards Long Jumps are real!", "Try it!"],
	["Now watch tech do the swap over speedrun!"],
	["ausrunsGGshake", "ausrunsGGshake"],
	["Has someone checked in on tech yet?"],
	["crowd jumpscare"],
	["Is Tasmania still attached to the logo?"],
	["ACE still trying to be discovered in AusSpeedruns graphics"],
	["It would suck if we were behind schedule", "Which we aren't... right?"],
	["GAME NAME", "By RUNNER NAME"],
	["By RUNNER NAME", "GAME NAME ...wait hang on"],
];

export const Transition: React.FC = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const transitionRef = useRef<HTMLDivElement>(null);
	const riveCanvasRef = useRef<HTMLCanvasElement>(null);
	// const textContainerRef = useRef<HTMLDivElement>(null);
	// const gameRef = useRef<HTMLSpanElement>(null);
	// const bylineRef = useRef<HTMLSpanElement>(null);
	// const staticImageRef = useRef<HTMLImageElement>(null);

	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [automationsRep] = useReplicant<Automations>("automations");

	const { rive: normalRive, RiveComponent: NormalTransitions } = useRive({
		src: "/bundles/asm-graphics/shared/design/asm_2025.riv",
		autoplay: false,
		artboard: "Artboard",
	});

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

	useEffect(() => {
		normalRive?.stopRendering();
	}, [normalRive]);

	function runTransition(transition: "toIntermission" | "toGame" | "basic", specialText: string[] = []) {
		if (!automationsRep?.runTransition) {
			console.log("Not running transition");
			return;
		}

		console.log("Running");

		if (!normalRive) {
			console.error("Rive instance not available");
			return;
		}

		// gameRef.current!.innerText = specialText[0] ?? "";
		// bylineRef.current!.innerText = specialText[2] ?? "";

		const tl = gsap.timeline();

		tl.to(transitionRef.current, { opacity: 1, duration: 0.5 });

		// tl.fromTo([textContainerRef.current, staticImageRef.current], { opacity: 0 }, { opacity: 1, duration: 1 }, "+=1");

		if (transition !== "toIntermission") {
			tl.call(
				() => {
					if (!audioRef.current) return;
					audioRef.current.src = ClipArray[Math.floor(Math.random() * ClipArray.length)];
					audioRef.current.play();
				},
				[],
				"+=1",
			);
		}

		tl.set(transitionRef.current, { opacity: 0 }, "+=5");

		// tl.to([textContainerRef.current, staticImageRef.current], { opacity: 0, duration: 1 }, "+=1");

		normalRive.startRendering();
		normalRive.reset();

		switch (transition) {
			case "basic":
				normalRive.setTextRunValue("GameText", "ASM 2025");
				normalRive.setTextRunValue("GameTextLayer1", "ASM 2025");
				normalRive.setTextRunValue("GameTextLayer2", "ASM 2025");
				normalRive.setTextRunValue("CategoryText", "AusSpeedruns presents");
				normalRive.setTextRunValue("RunnerText", "");
				break;
			case "toIntermission":
				normalRive.setTextRunValue("GameText", "ASM 2025");
				normalRive.setTextRunValue("GameTextLayer1", "ASM 2025");
				normalRive.setTextRunValue("GameTextLayer2", "ASM 2025");
				normalRive.setTextRunValue("CategoryText", specialText[0] ?? "");
				normalRive.setTextRunValue("RunnerText", specialText[1] ?? "");
				break;
			case "toGame":
			default:
				normalRive.setTextRunValue("GameText", specialText[0] ?? "");
				normalRive.setTextRunValue("GameTextLayer1", specialText[0] ?? "");
				normalRive.setTextRunValue("GameTextLayer2", specialText[0] ?? "");
				normalRive.setTextRunValue("CategoryText", specialText[1] ?? "");
				normalRive.setTextRunValue("RunnerText", specialText[2] ?? "");
				break;
		}

		normalRive.play("ToGame");
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv ref={transitionRef} style={{ opacity: 0 }}>
				<NormalTransitions />
				{/* <BasicTransition src={TransitionStatic} ref={staticImageRef} /> */}
				{/* <div
					style={{
						position: "absolute",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						fontSize: 60,
						color: "white",
						width: "100%",
						bottom: 200,
					}}
					ref={textContainerRef}>
					<span
						style={{
							fontFamily: "var(--secondary-font)",
							maxWidth: 1200,
							textAlign: "center",
							textWrap: "balance",
							fontWeight: 1000,
						}}
						ref={gameRef}></span>
					<span ref={bylineRef}></span>
				</div> */}
			</TransitionDiv>

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
		</TransitionContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Transition />);
