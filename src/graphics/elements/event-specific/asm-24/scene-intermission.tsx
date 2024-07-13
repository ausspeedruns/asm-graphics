import { Canvas, ObjectMap, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import HillModel from "./assets/IntermissionHill.glb?url";
import TVModel from "./assets/TV.glb?url";

import { City } from "./city";
import { lightValue } from "./time-utils";
import { Sky } from "./sky";
import { Tree } from "./tree";
import { ASRText } from "./letter-rotation";
import { useState } from "react";

type SceneIntermissionProps = {
	time?: number;
	videoRef?: HTMLVideoElement;
	donationTotal?: number;
};

const DEG_2_RAD = Math.PI / 180;

function exponentialDecay(a: number, b: number, decay: number, deltaTime: number) {
	return b + (a - b) * Math.exp(-decay * deltaTime);
}

export const SceneIntermission = (props: SceneIntermissionProps) => {
	const fogColour = new THREE.Color().lerpColors(
		new THREE.Color(0x000033),
		new THREE.Color(0x99caff),
		lightValue(props.time),
	);

	const { nodes: hillNodes, materials: hillMaterials } = useGLTF(HillModel) as GLTF & ObjectMap;
	const { nodes: tvNodes, materials: tvMaterials } = useGLTF(TVModel) as GLTF & ObjectMap;

	// let webcamTexture;
	// if (props.videoRef) {
	// 	webcamTexture = new THREE.VideoTexture(props.videoRef);
	// }

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

			<Tree color={new THREE.Color(0xffffff)} scale={2.1} position={[-1.3, -0.4, 0]} />
			{/* <Tree color={new THREE.Color(0xffffff)} scale={1.5} position={[-1.75, -0.65, 1]} /> */}
			<Tree color={new THREE.Color(0xffffff)} scale={1.8} position={[-2, -0.2, -1]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.4} position={[-2.1, -0.3, -0.5]} />
			<Tree color={new THREE.Color(0xffffff)} scale={1.8} position={[-1.5, -0.3, -1.5]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.2} position={[-1, -0.4, -2]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.1} position={[-1.5, -0.4, -2]} />

			<Tree color={new THREE.Color(0xffffff)} scale={1.9} position={[1.75, -0.4, 1]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.3} position={[2, -0.2, 0.5]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.0} position={[2, -0.4, 1.1]} />
			{/* <Tree color={new THREE.Color(0xffffff)} scale={1.7} position={[2, 0, -1]} /> */}
			{/* <Tree color={new THREE.Color(0xffffff)} scale={1.7} position={[1.8, 0, -1.5]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.1} position={[2.5, -0.1, -0.5]} />
			<Tree color={new THREE.Color(0xffffff)} scale={1.7} position={[2.7, -0.4, -1.4]} />
			<Tree color={new THREE.Color(0xffffff)} scale={2.0} position={[3.5, -0.4, -1]} /> */}

			<DonationTotal3D
				position={[1.1, 2.2, -2]}
				scale={1.2}
				rotation={[20 * DEG_2_RAD, -18 * DEG_2_RAD, 5 * DEG_2_RAD]}
			/>

			<group dispose={null}>
				<group position={[0, -0.501, 0]} scale={2.51} rotation={[10 * DEG_2_RAD, 0, 0]}>
					<mesh geometry={(hillNodes.Plane006_1 as THREE.Mesh).geometry} material={hillMaterials.Grass} />
					<mesh geometry={(hillNodes.Plane006_2 as THREE.Mesh).geometry} material={hillMaterials.Path} />
				</group>
			</group>

			{/* <group dispose={null}>
				<group position={[-1.3, -0.2, 0.7]} scale={0.2} rotation={[90 * DEG_2_RAD, 4 * DEG_2_RAD, -20 * DEG_2_RAD]}>
					<mesh geometry={(tvNodes.CRT_1 as THREE.Mesh).geometry} material={tvMaterials.Texture} />
					<mesh geometry={(tvNodes.CRT_2 as THREE.Mesh).geometry}>
						<meshBasicMaterial color={new THREE.Color(0x00ff00)} />
					</mesh>
				</group>
			</group> */}
			<group dispose={null} scale={0.21} position={[-1.1, -0.1, 0.8]}>
				<mesh geometry={(tvNodes.Cube006 as THREE.Mesh).geometry} material={tvMaterials["Texture.001"]} />
				<mesh geometry={(tvNodes.Cube006_1 as THREE.Mesh).geometry} material={tvMaterials.Screen} />
				<mesh geometry={(tvNodes.Cube006_2 as THREE.Mesh).geometry} material={tvMaterials.Buttons} />
			</group>
			<OrbitControls />
		</Canvas>
	);
};

type DonationTotal3DProps = {
	donationTotal?: number;
} & React.ComponentProps<typeof Center>;

const DonationTotal3D = (props: DonationTotal3DProps) => {
	const [displayedTotal, setDisplayedTotal] = useState(0);

	useFrame((_, deltaTime) => {
		if (!props.donationTotal || props.donationTotal == displayedTotal) return;

		setDisplayedTotal(Math.floor(exponentialDecay(displayedTotal, props.donationTotal, 25, deltaTime)));
	});

	return (
		<ASRText
			text={`$${displayedTotal.toLocaleString()}`}
			font="Noto Sans Bold"
			{...props}
		/>
	);
};

useGLTF.preload(HillModel);
useGLTF.preload(TVModel);
