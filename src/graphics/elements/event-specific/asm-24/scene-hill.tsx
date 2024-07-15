import React, { createContext, useEffect, useRef, useState, type CSSProperties } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Timer } from "@asm-graphics/types/Timer";

import { Sky } from "./sky";
import { Hill } from "./hill";
import { City } from "./city";
import { lightValue } from "./time-utils";
import { Timer3D } from "./timer-3d";
import { ASRText } from "./letter-rotation";
import { Estimate3D } from "./estimate";
import { AvailableFonts } from "./letter";

type SceneHillProps = {
	time: number;
	seed?: number;
	trees?: number;
	speedrunTime?: Timer;
	runData?: RunDataActiveRun;

	positions?: ContentPositioning;

	contentStyle: "standard" | "widescreen" | "standard-2p" | "widescreen-2p" | "gba" | "3ds-2p" | "tech-swapover";

	testSkyColours?: { stop: number; colour: string }[];

	hillSettings?: {
		hillScale?: THREE.Vector3;
	};

	className?: string;
	style?: CSSProperties;
};

type Transform = {
	scale?: number;
	position?: [number, number, number];
};

type ContentPositioning = {
	timer?: Transform;
	hillXPos?: number;
	hillYPos?: number;
};

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

export const SceneHill = (props: SceneHillProps) => {
	return (
		<Canvas flat>
			<SceneHillR3F {...props} />
		</Canvas>
	);
};

type LetterAnimationOccurance = {
	position: number[];
	time: number;	
} | null;
export const LetterAnimationContext = createContext<LetterAnimationOccurance>(null);

const timerWorldPositions: Record<SceneHillProps["contentStyle"], number[]> = {
	"widescreen": [2.1, 1.46, 0],
	"standard": [0, 0.87, 0],
	"standard-2p": [-1.76, 1.05, 0],
	"widescreen-2p": [-1.76, -0.5, 0],
	"gba": [0, 1, 0],
	"3ds-2p": [0.45, 0.0288, 0],
	"tech-swapover": [0, 0, 0],
}

const SceneHillR3F = (props: SceneHillProps) => {
	// const [spacebarPressed, setSpacebarPressed] = useState(false);
	const [timerState, setTimerState] = useState<string | undefined>("started");
	const [letterAnimationOccurance, setLetterAnimationOccurance] = useState<LetterAnimationOccurance>(null);
	const { viewport, clock } = useThree();

	const fogColour = new THREE.Color().lerpColors(
		new THREE.Color(0x000033),
		new THREE.Color(0x99caff),
		lightValue(props.time),
	);

	const gameName = props.runData?.customData.gameDisplay ?? props.runData?.game ?? "";

	// useEffect(() => {
	// 	const handleKeyDown = (event: KeyboardEvent) => {
	// 		setSpacebarPressed(event.code === "Space");
	// 	};

	// 	const handleKeyUp = (event: KeyboardEvent) => {
	// 		setSpacebarPressed(!(event.code === "Space"));
	// 	};

	// 	window.addEventListener("keydown", handleKeyDown);
	// 	window.addEventListener("keyup", handleKeyUp);

	// 	return () => {
	// 		window.removeEventListener("keydown", handleKeyDown);
	// 		window.removeEventListener("keyup", handleKeyUp);
	// 	};
	// }, []);

	const bayer128 = props.contentStyle === "3ds-2p" || props.contentStyle === "standard-2p";

	const gameTitleHasNewLine = gameName.includes("\n") || gameName.includes("\\n");

	useEffect(() => {
		if (props.speedrunTime?.state === "running" && timerState !== "running") {
			setTimerState("running");
			setLetterAnimationOccurance({
				position: timerWorldPositions[props.contentStyle],
				time: clock.elapsedTime,
			})
		} else {
			setTimerState(props.speedrunTime?.state);
		}
	}, [props.speedrunTime]);

	return (
		<LetterAnimationContext.Provider value={letterAnimationOccurance}>
			<OrthographicCamera makeDefault position={[0, 0, 8]} zoom={275} />
			<fog attach="fog" args={[fogColour, 3, 10]} />
			<Sky time={props.time} position={[0, 0, -1]} bayer128={bayer128} testSkyColours={props.testSkyColours} />
			<City
				position={[
					props.positions?.hillXPos ?? 0,
					-viewport.height / 2 + 1.6 + (props.positions?.hillYPos ?? 0),
					0.1,
				]}
				scale={3}
				time={props.time}
			/>
			<Hill
				position={[props.positions?.hillXPos ?? 0, -viewport.height / 2 + (props.positions?.hillYPos ?? 0), 2]}
				treeNumber={props.trees ?? 30}
				scale={1.1}
				seed={props.seed ?? 0}
				time={props.time}
				hillScale={props.hillSettings?.hillScale}
			/>
			{/* <Stopwatch time={props.speedrunTime?.milliseconds} position={[0, 1.45, 1]} scale={4} /> */}

			{props.contentStyle === "standard" && (
				<group scale={0.6}>
					<Timer3D timer={props.speedrunTime} position={[0, 1.45, 0]} scale={0.9} />
					<Estimate3D estimate={props.runData?.estimate} position={[0, 0.95, 0]} scale={0.35} />
					<group position={[0, gameTitleHasNewLine ? 0.5 : 0.6, 0]}>
						<ASRText text={gameName} font="Russo One" scale={0.4} position={[0, 0, 0]} />
						<Center
							position={[0, gameTitleHasNewLine ? -0.35 : -0.25, 0]}
							scale={0.25}
							cacheKey={`${props.runData?.system}-${props.runData?.release}`}>
							<ASRText
								text={`${props.runData?.system ?? ""}     ${props.runData?.release ?? ""}`}
								font="Noto Sans"
							/>
						</Center>
						{/* <Center position={[0, -0.3, 0]}>
							<group scale={0.3}>
								<ASRText
									text={props.runData?.system}
									font="Noto Sans"
									position={[-2, 0, 0]}
								/>
								<ASRText text={props.runData?.release} font="Noto Sans" position={[2, 0, 0]} />
							</group>
						</Center> */}
					</group>
					<ASRTextMaxWidth
						text={props.runData?.category?.toLocaleUpperCase()}
						preferredScale={0.4}
						position={[0, gameTitleHasNewLine ? -0.18 : -0.1, 0]}
						maxWidth={0.8}
					/>
				</group>
			)}

			{props.contentStyle === "widescreen" && (
				<group scale={0.6} position={[0, 1.46, 0]}>
					<Timer3D timer={props.speedrunTime} position={[3.5, 0, 0]} />
					<Center position={[-3.5, gameTitleHasNewLine ? 0.05 : 0, 0]}>
						<ASRTextMaxWidth
							text={gameName}
							font="Russo One"
							preferredScale={0.6}
							position={[0, gameTitleHasNewLine ? 0.3 : 0.14, 0]}
							maxWidth={1.4}
						/>
						{/* <group scale={0.3} position={[0, gameTitleHasNewLine ? -0.2 : -0.2, 0]}>
							<ASRText text={props.runData?.system} font="Noto Sans" position={[-2, 0, 0]} />
							<ASRText text={props.runData?.release} font="Noto Sans" position={[2, 0, 0]} />
						</group> */}
						<Center
							position={[0, gameTitleHasNewLine ? -0.2 : -0.2, 0]}
							scale={0.3}
							cacheKey={`${props.runData?.system}-${props.runData?.release}`}>
							<ASRText
								text={`${props.runData?.system ?? ""}     ${props.runData?.release ?? ""}`}
								font="Noto Sans"
							/>
						</Center>
					</Center>
					<Center position={[0, 0, 0]}>
						<ASRTextMaxWidth
							text={props.runData?.category?.toLocaleUpperCase()}
							preferredScale={0.5}
							maxWidth={0.8}
						/>
						<Estimate3D estimate={props.runData?.estimate} position={[0, -0.3, 0]} scale={0.35} />
					</Center>
				</group>
			)}

			{props.contentStyle === "standard-2p" && (
				<>
					<Sky time={props.time} position={[0, 0.365, -0.99]} scale={0.8} xExtraWidth={100} bayer128 />
					<group scale={0.6} position={[-2.3, 1.2, 0]}>
						<Timer3D timer={props.speedrunTime} position={[0.9, -0.25, 0]} scale={0.6} />
						<group position={[0, 0.5, 0]}>
							<ASRText text={gameName} font="Russo One" scale={0.37} position={[0, 0.2, 0]} />
							<group scale={0.3} position={[0, -0.2, 0]}>
								<ASRText
									text={`${props.runData?.system ?? ""}     ${props.runData?.release ?? ""}`}
									font="Noto Sans"
								/>
							</group>
						</group>
						<group position={[-1.05, -0.1, 0]}>
							<ASRTextMaxWidth
								text={props.runData?.category?.toLocaleUpperCase()}
								preferredScale={0.5}
								maxWidth={0.5}
							/>
							<Estimate3D estimate={props.runData?.estimate} position={[0, -0.3, 0]} scale={0.35} />
						</group>
					</group>
				</>
			)}

			{props.contentStyle === "widescreen-2p" && (
				<>
					<City position={[0, -0.7, 0.1]} scale={3} time={props.time} />
					<City position={[3, -0.7, 0.1]} scale={3} time={props.time} />
					<City position={[-3, -0.7, 0.1]} scale={3} time={props.time} />
					<group scale={0.6} position={[-2.3, 1.2, 0]}>
						<Timer3D timer={props.speedrunTime} position={[0.9, -0.5, 0]} scale={0.6} />
						<group position={[0, 0.4, 0]}>
							<ASRText text={gameName} font="Russo One" scale={0.5} position={[0, 0.2, 0]} />
							<group scale={0.3} position={[0, -0.3, 0]}>
								<ASRText
									text={`${props.runData?.system ?? ""}     ${props.runData?.release ?? ""}`}
									font="Noto Sans"
								/>
							</group>
						</group>
						<group position={[-1, -0.38, 0]}>
							<ASRTextMaxWidth
								text={props.runData?.category?.toLocaleUpperCase()}
								preferredScale={0.5}
								maxWidth={0.5}
							/>
							<Estimate3D estimate={props.runData?.estimate} position={[0, -0.3, 0]} scale={0.35} />
						</group>
					</group>
				</>
			)}

			{props.contentStyle === "3ds-2p" && (
				<group scale={0.6}>
					<Sky time={props.time} position={[0, -1, -0.99]} bayer128 scale={6} />
					<group position={[-1, 0.08, 0]} scale={0.26}>
						<ASRText text={gameName} font="Russo One" />
						<Center scale={0.9} position={[0, -1.1, 0]}>
							<ASRText
								text={`${props.runData?.system ?? ""}     ${props.runData?.release ?? ""}`}
								font="Noto Sans"
							/>
						</Center>
					</group>
					<group position={[1.25, 0.08, 0]} scale={0.6}>
						<Timer3D timer={props.speedrunTime} />
						<group position={[0, -0.6, 0]} scale={0.5}>
							<ASRText
								text={props.runData?.category?.toLocaleUpperCase()}
								font="Noto Sans Bold"
								position={[-1.5, 0, 0]}
							/>
							<Estimate3D estimate={props.runData?.estimate} position={[1.5, 0, 0]} />
						</group>
					</group>
				</group>
			)}

			{props.contentStyle === "gba" && (
				<group scale={0.4}>
					<Timer3D timer={props.speedrunTime} position={[0, 2.5, 0]} />
					<Estimate3D estimate={props.runData?.estimate} position={[0, 1.85, 0]} scale={0.5} />
					<group position={[0, gameTitleHasNewLine ? 1.2 : 1.3, 0]}>
						<ASRText text={gameName} font="Russo One" scale={0.5} position={[0, 0, 0]} />
						<Center
							position={[0, gameTitleHasNewLine ? -0.5 : -0.4, 0]}
							scale={0.4}
							cacheKey={`${props.runData?.system}-${props.runData?.release}`}>
							<ASRText
								text={`${props.runData?.system ?? ""}     ${props.runData?.release ?? ""}`}
								font="Noto Sans"
							/>
						</Center>
						{/* <Center position={[0, -0.3, 0]}>
							<group scale={0.3}>
								<ASRText
									text={props.runData?.system}
									font="Noto Sans"
									position={[-2, 0, 0]}
								/>
								<ASRText text={props.runData?.release} font="Noto Sans" position={[2, 0, 0]} />
							</group>
						</Center> */}
					</group>
					<ASRTextMaxWidth
						text={props.runData?.category?.toLocaleUpperCase()}
						preferredScale={0.5}
						position={[0, gameTitleHasNewLine ? 0.3 : 0.4, 0]}
						maxWidth={0.7}
					/>
				</group>
			)}

			{props.contentStyle === "tech-swapover" && (
				<>
					<City
						position={[3, -viewport.height / 2 + 1.6 + (props.positions?.hillYPos ?? 0), 0.1]}
						scale={3}
						time={props.time}
					/>
					<City
						position={[-3, -viewport.height / 2 + 1.6 + (props.positions?.hillYPos ?? 0), 0.1]}
						scale={3}
						time={props.time}
					/>
				</>
			)}

			{/* {spacebarPressed && (
				<OrbitControls />
			)} */}
		</LetterAnimationContext.Provider>
	);
};

type ASRTextMaxWidth = {
	text?: string;
	maxWidth: number;
	preferredScale: number;
	font?: AvailableFonts;
} & React.ComponentProps<typeof Center>;

const ASRTextMaxWidth = (props: ASRTextMaxWidth) => {
	const textBoundsRef = useRef<THREE.Group>(null);
	const text = props.text ?? "";

	// useEffect(() => {
	//     if (!textBoundsRef.current) return;

	//     // Reset scale of text to preffered scale
	//     textBoundsRef.current.scale.setX(props.preferredScale);

	// 	// Create bounding box
	//     const bb = new THREE.Box3().setFromObject(textBoundsRef.current);
	//     let boundingBoxSize = new THREE.Vector3();
	//     bb.getSize(boundingBoxSize);

	//     if (isNaN(boundingBoxSize.x) || boundingBoxSize.x === 0) return;

	//     // Rescale based on maxWidth and preferredScale
	//     const newScale = Math.min(props.maxWidth / boundingBoxSize.x, props.preferredScale);
	// 	console.log(textBoundsRef.current.scale.x, boundingBoxSize.x, newScale)
	//     textBoundsRef.current.scale.setX(newScale);
	// }, [props.text, props.preferredScale, props.maxWidth]);
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!textBoundsRef.current) return;

			// Reset scale of text to preffered scale
			textBoundsRef.current.scale.setX(props.preferredScale);

			// Create bounding box
			const bb = new THREE.Box3().setFromObject(textBoundsRef.current);
			let boundingBoxSize = new THREE.Vector3();
			bb.getSize(boundingBoxSize);

			if (isNaN(boundingBoxSize.x) || boundingBoxSize.x === 0) return;

			// Rescale based on maxWidth and preferredScale
			const newScale = Math.min(props.maxWidth / boundingBoxSize.x, props.preferredScale);
			// console.log(textBoundsRef.current.scale.x, boundingBoxSize.x, newScale)
			textBoundsRef.current.scale.setX(newScale);
		}, 0);

		return () => clearTimeout(timeout);
	}, [props.text, props.preferredScale, props.maxWidth]);

	return (
		<group {...props} ref={textBoundsRef} scale={props.preferredScale}>
			<ASRText text={text} font={props.font ?? "Noto Sans Bold"} />
		</group>
	);
};
