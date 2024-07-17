import { useEffect, useRef, useState } from "react";
import { Canvas, ObjectMap, useFrame } from "@react-three/fiber";
import { Center, Html, OrbitControls, PerspectiveCamera, useGLTF, useTexture } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";

import HillModel from "./assets/IntermissionHill.glb?url";
import TVModel from "./assets/TV.glb?url";

import { City } from "./city";
import { lightValue } from "./time-utils";
import { Sky } from "./sky";
import { Tree } from "./tree";
import { ASRText } from "./letter-rotation";
import { timeOfDayTint } from "./colours";

import Grass from "./assets/grass.png";
import Path from "./assets/path.jpg";
import TVTexture from "./assets/TV.png";
import { IntermissionAds, IntermissionAdsRef } from "../../../elements/intermission/ad";
import { useListenFor } from "@nodecg/react-hooks";
// import TVTexture from "./assets/UV Grid.png";

type SceneIntermissionProps = {
	time?: number;
	videoRef?: HTMLVideoElement | null;
	donationTotal?: number;
};

const DEG_2_RAD = Math.PI / 180;

// function exponentialDecay(a: number, b: number, decay: number, deltaTime: number) {
// 	return b + (a - b) * Math.exp(-decay * deltaTime);
// }

export const SceneIntermission = (props: SceneIntermissionProps) => {
	const fogColour = new THREE.Color().lerpColors(
		new THREE.Color(0x000033),
		new THREE.Color(0x99caff),
		lightValue(props.time),
	);

	const hillColour = timeOfDayTint(props.time ?? 0);

	let webcamTexture;
	if (props.videoRef) {
		webcamTexture = new THREE.VideoTexture(props.videoRef);
	}

	return (
		<Canvas>
			<PerspectiveCamera
				makeDefault
				position={[-1, -0.3, 3]}
				fov={48.5}
				rotation={[5 * DEG_2_RAD, -15 * DEG_2_RAD, 0]}
			/>
			<fog attach="fog" args={[fogColour, 0, 9]} />
			<Sky
				time={props.time ?? 0}
				position={[2, 2.5, -5]}
				scale={2.5}
				rotation={[0 * DEG_2_RAD, -18 * DEG_2_RAD, 0]}
			/>
			<City position={[1, 1.9, -3]} scale={4} time={props.time} rotation={[0 * DEG_2_RAD, -15 * DEG_2_RAD, 0]} />
			<City
				position={[-2.9, 1.9, -3.45]}
				scale={4}
				time={props.time}
				rotation={[0 * DEG_2_RAD, 0 * DEG_2_RAD, 0]}
			/>
			<City
				position={[4.6, 1.9, -1.5]}
				scale={4}
				time={props.time}
				rotation={[0 * DEG_2_RAD, -30 * DEG_2_RAD, 0]}
			/>

			<IntermissionHill
				color={hillColour}
				position={[0, -0.501, 0]}
				scale={2.51}
				rotation={[10 * DEG_2_RAD, 0, 0]}
			/>

			<Tree color={hillColour} scale={2.1} position={[-1.3, -0.4, 0]} />
			{/* <Tree color={hillColour} scale={1.5} position={[-1.75, -0.65, 1]} /> */}
			<Tree color={hillColour} scale={1.8} position={[-2, -0.2, -1]} />
			<Tree color={hillColour} scale={2.4} position={[-2.1, -0.3, -0.5]} />
			<Tree color={hillColour} scale={1.8} position={[-1.5, -0.3, -1.5]} />
			<Tree color={hillColour} scale={2.2} position={[-1, -0.4, -2]} />
			<Tree color={hillColour} scale={2.1} position={[-1.5, -0.4, -2]} />

			<Tree color={hillColour} scale={1.9} position={[1.75, -0.4, 1]} />
			<Tree color={hillColour} scale={2.3} position={[2, -0.2, 0.5]} />
			<Tree color={hillColour} scale={2.0} position={[2, -0.4, 1.1]} />
			{/* <Tree color={hillColour} scale={1.7} position={[2, 0, -1]} /> */}
			{/* <Tree color={hillColour} scale={1.7} position={[1.8, 0, -1.5]} />
			<Tree color={hillColour} scale={2.1} position={[2.5, -0.1, -0.5]} />
			<Tree color={hillColour} scale={1.7} position={[2.7, -0.4, -1.4]} />
			<Tree color={hillColour} scale={2.0} position={[3.5, -0.4, -1]} /> */}

			<DonationTotal3D
				donationTotal={props.donationTotal ?? 0}
				position={[0.9, 2.2, -2]}
				scale={1.2}
				rotation={[20 * DEG_2_RAD, -18 * DEG_2_RAD, 5 * DEG_2_RAD]}
			/>

			<TV
				scale={0.21}
				rotation={[-0.1, 0, 0.1]}
				position={[-1.06, -0.2, 0.9]}
				color={hillColour}
				webcamTexture={webcamTexture}
			/>
			<OrbitControls />
		</Canvas>
	);
};

const CameraAnim = () => {
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);

	useFrame(({ clock }) => {
		if (!cameraRef.current) return;
	});

	return (
		<PerspectiveCamera
			ref={cameraRef}
			makeDefault
			position={[-1, -0.3, 3]}
			fov={48.5}
			rotation={[5 * DEG_2_RAD, -15 * DEG_2_RAD, 0]}
		/>
	);
};

type DonationTotal3DProps = {
	donationTotal: number;
} & React.ComponentProps<typeof Center>;

function easeOutCubic(x: number): number {
	return 1 - Math.pow(1 - x, 3);
}

const DonationTotal3D = (props: DonationTotal3DProps) => {
	const [displayValue, setDisplayValue] = useState(0);
	const [startValue, setStartValue] = useState<number | null>(0);
	const [t, setT] = useState<number>(0);

	useFrame((_, deltaTime) => {
		if (props.donationTotal !== displayValue && !startValue) {
			setStartValue(displayValue);
		}

		if (startValue !== null) {
			setT((prevT) => prevT + deltaTime * 0.1);
			const realT = easeOutCubic(t + deltaTime);

			setDisplayValue((1 - realT) * startValue + realT * props.donationTotal);

			if (realT >= 1) {
				setDisplayValue(props.donationTotal);
				setStartValue(null);
				setT(0);
			}
		}
	});

	return (
		<ASRText
			dontUpdateCenter
			text={`$${Math.floor(displayValue).toLocaleString()}`}
			font="Noto Sans Bold"
			cacheKey={Math.floor(displayValue).toString().length}
			{...props}
		/>
	);
};

type IntermissionHillProps = {
	color?: THREE.Color;
} & JSX.IntrinsicElements["group"];

const IntermissionHill = (props: IntermissionHillProps) => {
	const grassTexture = useTexture(Grass) as THREE.Texture;
	const pathTexture = useTexture(Path) as THREE.Texture;
	const { nodes: hillNodes } = useGLTF(HillModel) as GLTF & ObjectMap;
	grassTexture.minFilter = THREE.NearestFilter;
	grassTexture.magFilter = THREE.NearestFilter;
	grassTexture.wrapS = THREE.RepeatWrapping;
	grassTexture.wrapT = THREE.RepeatWrapping;
	pathTexture.minFilter = THREE.NearestFilter;
	pathTexture.magFilter = THREE.NearestFilter;
	pathTexture.wrapS = THREE.RepeatWrapping;
	pathTexture.wrapT = THREE.RepeatWrapping;

	return (
		<group dispose={null} {...props}>
			<mesh geometry={(hillNodes.Plane006_1 as THREE.Mesh).geometry}>
				<meshBasicMaterial map={grassTexture} color={props.color} />
			</mesh>
			<mesh geometry={(hillNodes.Plane006_2 as THREE.Mesh).geometry}>
				<meshBasicMaterial map={pathTexture} color={props.color} />
			</mesh>
		</group>
	);
};

type TVProps = {
	color?: THREE.Color;
	webcamTexture?: THREE.Texture;
} & JSX.IntrinsicElements["group"];

const TV = (props: TVProps) => {
	const texture = useTexture(TVTexture) as THREE.Texture;
	const { nodes } = useGLTF(TVModel) as GLTF & ObjectMap;
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	// texture.wrapS = THREE.RepeatWrapping;
	// texture.repeat.x = - 1;
	texture.flipY = false;

	return (
		<group dispose={null} {...props}>
			<mesh geometry={(nodes.Cube006 as THREE.Mesh).geometry}>
				<meshBasicMaterial map={texture} color={props.color} />
				{/* <meshBasicMaterial color={props.color} /> */}
			</mesh>
			<mesh geometry={(nodes.Cube006_1 as THREE.Mesh).geometry}>
				{/* <meshBasicMaterial map={props.webcamTexture} /> */}
				{/* {props.webcamTexture ? (
					<meshBasicMaterial map={props.webcamTexture} />
				) : (
					<meshBasicMaterial color={new THREE.Color(0xff00ff)} />
				)} */}
				{/* <Html transform scale={0.23} position={[-0.066, -0.02, 1.9]} occlude="blending"> */}
				<Html transform scale={0.23} position={[-0.066, -0.02, 1.85]}>
					<IntermissionCamera />
				</Html>
			</mesh>
			<mesh geometry={(nodes.Cube006_2 as THREE.Mesh).geometry}>
				<meshBasicMaterial color={props.color} />
			</mesh>
		</group>
	);
};

const IntermissionCamera = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const adsRef = useRef<IntermissionAdsRef>(null);
	const adsContainerRef = useRef<HTMLDivElement>(null);

	useListenFor("playAd", (newVal) => {
		if (!adsRef.current || !adsContainerRef.current) return;

		let adDuration = 0;
		switch (newVal) {
			case "GOC":
				adDuration = 36;
				break;
			case "Laptop":
				adDuration = 60;
				break;
			case "Raider_GE78":
				adDuration = 84;
				break;
			case "Vector_17":
				adDuration = 85;
				break;
			case "Prestige_13":
				adDuration = 81;
				break;
			case "Stealth_Laptop":
				adDuration = 87;
				break;
			case "Katana_Laptop":
				adDuration = 86;
				break;
			case "Thin_15":
				adDuration = 58;
				break;
			default:
				return;
		}

		const tl = gsap.timeline();
		tl.to(adsContainerRef.current, { opacity: 1, duration: 2, delay: 5 });
		tl.call(() => adsRef.current?.showAd(newVal));
		tl.to(adsContainerRef.current, { opacity: 0, duration: 2 }, `+=${adDuration}`);
	});

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const constraints = { video: { width: 1280, height: 720, facingMode: "user" } };
			// const constraints = { video: { width: 640, height: 480, facingMode: "user" } };

			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(function (stream) {
					if (!videoRef.current) return;
					// apply the stream to the video element used in the texture

					videoRef.current.srcObject = stream;
					videoRef.current.play();
				})
				.catch(function (error) {
					console.error("Unable to access the camera/webcam.", error);
				});
		} else {
			console.error("MediaDevices interface not available.");
		}
	}, [videoRef]);
	return (
		<div style={{ clipPath: "polygon(18% 0, 82% 0, 82% 100%, 18% 100%)" }}>
			<video ref={videoRef} />
			<div
				ref={adsContainerRef}
				style={{ opacity: 0, top: 0, position: "absolute", width: "100%", height: "100%" }}>
				<IntermissionAds ref={adsRef} />
			</div>
		</div>
	);
};

useGLTF.preload(HillModel);
useGLTF.preload(TVModel);
