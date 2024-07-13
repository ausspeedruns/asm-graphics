import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { ObjectMap, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import type { Mesh } from "three";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import ASM2024Model from "./assets/ASM2024Textured.glb?url";

const modelZOffset = 0.07;
const modelXOffset = -0.0258;

export function ASM2024Logo(props: { targetRotation?: THREE.Euler } & ThreeElements["group"]) {
	const groupRef = useRef<THREE.Group>(null);
	const { viewport } = useThree();
	const { nodes, materials } = useGLTF(ASM2024Model) as GLTF & ObjectMap;
	// const rotation = new THREE.Quaternion();
	const bobRotation = new THREE.Euler();

	useFrame((state) => {
		const group = groupRef.current;
		if (!group) return;

		// const yPos = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 0.05;

		bobRotation.y = state.clock.elapsedTime * 0.5;

		// rotation.premultiply((new THREE.Quaternion()).setFromEuler(bobRotation))

		// group.position.set(0, yPos, 0);
		group.quaternion.setFromEuler(bobRotation);
	});

	const material = materials["ASM Logo"];
	material.vertexColors = true;
	material.side = THREE.FrontSide;

	return (
		<group {...props} scale={viewport.width * 0.45} dispose={null} ref={groupRef}>
			<mesh geometry={(nodes.ASM24 as Mesh).geometry} material={material} position={[-modelXOffset, 0, modelZOffset]} />
			<mesh
				geometry={(nodes.ASM24 as Mesh).geometry}
				material={material}
				rotation={[0, Math.PI, 0]}
				position={[modelXOffset, 0, -modelZOffset]}
			/>
		</group>
	);
}

useGLTF.preload(ASM2024Model);
