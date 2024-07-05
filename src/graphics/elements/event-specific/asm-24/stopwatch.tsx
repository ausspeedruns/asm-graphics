import { Center, useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import { Color } from "three";
import * as THREE from "three";

import StopwatchModel from "./assets/Stopwatch.glb?url";

const DEG_2_RAD = Math.PI / 180;

type StopwatchProps = {
	time?: number; // In ms
} & JSX.IntrinsicElements["group"];

export const Stopwatch = (props: StopwatchProps) => {
	const stopwatchRef = useRef<THREE.Group>(null);
	const { nodes } = useGLTF(StopwatchModel);
	const minutes = (props.time ?? 0) / 60000;
	const hours = minutes / 60;

	return (
		<group {...props} dispose={null}>
			<group
				ref={stopwatchRef}
				position={[0, 0, -0.015]}
				rotation={[Math.PI / 2, 0, 0]}
				scale={[0.039, 0.094, 0.039]}>
				<mesh geometry={nodes.Circle004.geometry}>
					<meshBasicMaterial color={new Color(0x111111)} fog={false} />
				</mesh>
				<mesh geometry={nodes.Circle004_1.geometry}>
					<textMaterial />
				</mesh>
			</group>
			<mesh geometry={nodes.MinuteHand.geometry} rotation={[Math.PI / 2, -(minutes * 6) * DEG_2_RAD, 0]} scale={[0.039, 0.094, 0.039]}>
				<textMaterial />
			</mesh>
			<mesh geometry={nodes.HourHand.geometry} rotation={[Math.PI / 2, -((hours * 30) - 90) * DEG_2_RAD, 0]} scale={[0.039, 0.094, 0.039]}>
				<textMaterial />
			</mesh>
		</group>
	);
};

useGLTF.preload(StopwatchModel);
