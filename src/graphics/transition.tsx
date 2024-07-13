import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import styled, { keyframes } from "styled-components";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
// import { useRive } from "@rive-app/react-canvas";

// import ASMLogo from './media/ASM2022 Logo.svg';
// import BGIMG from './media/pixel/Transition/BG.png';
// import StartWipeIMG from './media/pixel/Transition/StartWipe.png';
// import EndWipeIMG from './media/pixel/Transition/EndWipe.png';

// @ts-ignore
// import ASAP23Transition from "./elements/event-specific/pax-23/asap2023_transition.riv";
import ASGX23Transitions from "./elements/event-specific/tgx-24/";

// import Clip1 from "./media/audio/chestappears1.mp3";
// import Clip2 from "./media/audio/crystal.mp3";
// import Clip3 from "./media/audio/heartcontainer1.mp3";
// import Clip4 from "./media/audio/heartpiece1.mp3";
// import Clip5 from "./media/audio/itemget1.mp3";

import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import NodeCG from "@nodecg/types";
import { ASM2024Logo } from "./elements/event-specific/asm-24/asm24-logo";

// const ClipArray = [Clip1, Clip2, Clip3, Clip4, Clip5];

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
	opacity: 0;

	background-size: cover;
	background-position: center;
	image-rendering: pixelated;

	color: white;
	font-family: "Noto Sans";

	& div {
		position: absolute;
	}
`;

const LoadingTextAnimation = keyframes`
	50% {
		opacity: 0;
	}
`;

const LoadingText = styled.div`
	animation: ${LoadingTextAnimation} 2s step-start infinite;
	text-transform: uppercase;
	font-family: "Russo One";
	font-size: 100px;
	-webkit-text-stroke-width: 20px;
	-webkit-text-stroke-color: black;
	paint-order: stroke fill;
`;

const LoadingBar = styled.div`
	width: 1600px;
	height: 50px;
	background: black;
	border: 10px solid black;
`;

const LoadingBarProgress = styled.div`
	position: absolute;
	width: 0;
	height: 100%;
	background-color: white;
`;

const GameplayTip = styled.div`
	font-size: 50px;
	color: #ccc;
	font-style: italic;
`;

function runString(runData: RunDataActiveRun | undefined) {
	if (!runData) return ["Enjoy the run!"];

	const allRunners = runData.teams.flatMap((team) => team.players.map((player) => player.name));

	return [runData.game ?? "???", `By ${new Intl.ListFormat().format(allRunners)}`];
}

THREE.ShaderChunk.project_vertex = `
 	// vec2 resolution = vec2(320, 240);
 	vec2 resolution = vec2(192, 144);
 	//vec2 resolution = vec2(2, 1);
	vec4 mvPosition = vec4(transformed, 1.0);

	mvPosition = modelViewMatrix * mvPosition;

	gl_Position = projectionMatrix * mvPosition;
 	gl_Position.xyz /= gl_Position.w;
 	gl_Position.xy = floor(resolution * gl_Position.xy) / resolution;
 	gl_Position.xyz *= gl_Position.w;
`;


const TAGLINES = [
	["Hi Mum!"],
	["Hi Dad!"],
	["Spedrn"],
	["I hope we're on time"],
	["What a great run!"],
	["Daily reminder", "Speedrun is one word"],
	// ["Backwards Long Jumps are real!", "Try it!"],
	["Now watch tech do the swap over speedrun!"],
	["ausrunsGGshake", "ausrunsGGshake"],
	["Has someone checked in on tech yet?"],
	["crowd jumpscare"],
	["Is Tasmania still attached to the logo?"],
	// ["ACE still trying to be discovered in AusSpeedruns graphics"],
	["It would suck if we were behind schedule", "Which we aren't... right?"],
	["GAME NAME", "By RUNNER NAME"],
	["By RUNNER NAME", "GAME NAME ...wait hang on"],
];

function loadingSteps(steps: number) {
    const stepPoints = [];
    for (let i = 0; i < steps; i++) {
        let randomPoint = Math.random();

        if (i == 0) {
            stepPoints.push(randomPoint);
            continue;
        }

        randomPoint += stepPoints[i - 1];
        stepPoints.push(randomPoint);
    }

    // Normalise
    const maxPoint = stepPoints[stepPoints.length - 1];
    const normalisedStepPoints = stepPoints.map((point) => (point / maxPoint) * 100);

    // Convert to array of objects
    const stepsArray = normalisedStepPoints.map((normalizedPoint) => ({
        step: normalizedPoint,
        wait: Math.random() > 0.3 ? Math.random() : 0,
        duration: Math.random(),
    }));

	// Make sure the transition is at least 5 seconds
	const totalTime = Math.max(5, stepsArray.reduce((total, step) => total + step.wait + step.duration, 0));
	stepsArray.forEach((step) => {
		step.wait *= (5 / totalTime);
		step.duration *= (5 / totalTime);
	});

    return stepsArray;
}

export const Transition: React.FC = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const transitionRef = useRef<HTMLDivElement>(null);
	const loadingBarRef = useRef<HTMLDivElement>(null);
	const gamingTipsRef = useRef<HTMLDivElement>(null);
	const [transitionPhotosRep] = useReplicant<NodeCG.AssetFile[]>("assets:transitionPhotos");
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

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
	});

	// useEffect(() => {
	// 	normalRive?.stopRendering();
	// }, [normalRive]);

	function runTransition(transition: "toIntermission" | "toGame" | "basic", specialText: string[] = []) {
		console.log("Running");

		const tl = gsap.timeline();
		// tl.call(
		// 	() => {
		// 		if (!audioRef.current) return;
		// 		audioRef.current.src = ClipArray[Math.floor(Math.random() * ClipArray.length)];
		// 		audioRef.current.play();
		// 	},
		// 	[],
		// 	"+=2",
		// );

		if (gamingTipsRef.current) {
			let prefix = "";

			if (transition === "toIntermission") {
				prefix = "TIP: ";
			}

			gamingTipsRef.current.innerText = prefix + specialText.join(" - ");
		}

		switch (transition) {
			case "basic":
			case "toIntermission":
			case "toGame":
			default:
				if (!transitionRef.current) return;
				tl.set(loadingBarRef.current, { width: 0 });

				console.log(transitionPhotosRep);
				if (transitionPhotosRep) {
					const imageSrc = transitionPhotosRep[Math.floor(Math.random() * transitionPhotosRep.length)].url;
					transitionRef.current.style.backgroundImage = `url(${imageSrc})`;

					console.log(`Setting image to ${imageSrc}`, transitionRef.current.style.backgroundImage);
				}

				tl.fromTo(transitionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });


				const loadingBarAnim = loadingSteps(4);
				for (let i = 0; i < loadingBarAnim.length; i++) {
					const step = loadingBarAnim[i];
					tl.to(loadingBarRef.current, { width: `${step.step}%`, duration: step.duration, ease: "linear" }, `+=${step.wait}`)
					
				}
				// tl.fromTo(loadingBarRef.current, { width: "0" }, { width: "100%", duration: 5 }, "+=0.5");

				tl.fromTo(transitionRef.current, { opacity: 1 }, { opacity: 0, duration: 0.5 }, "+=0.5");
				break;
		}
	}

	const changeBGColor = (col: string) => {
		document.body.style.background = col;
	};

	return (
		<TransitionContainer>
			<TransitionDiv ref={transitionRef}>
				{/* <NormalTransitions /> */}
				<Canvas
					flat
					style={{ position: "absolute", width: "100%", height: "70%", top: 0 }}
					camera={{ position: [0, 0, 12], fov: 40 }}>
					<Center scale={0.75}>
						<ASM2024Logo />
					</Center>
				</Canvas>
				<div style={{ width: "100%", display: "flex", justifyContent: "center", top: 700 }}>
					<GameplayTip ref={gamingTipsRef} />
				</div>
				<div style={{ width: "100%", display: "flex", justifyContent: "center", top: 800 }}>
					<LoadingBar>
						<LoadingBarProgress ref={loadingBarRef} />
					</LoadingBar>
				</div>
				<div style={{ width: "100%", display: "flex", justifyContent: "center", top: 900 }}>
					<LoadingText>Loading</LoadingText>
				</div>
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
				onClick={() => runTransition("toIntermission", TAGLINES[Math.floor(Math.random() * TAGLINES.length)])}>
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
