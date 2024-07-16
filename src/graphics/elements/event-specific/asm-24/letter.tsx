import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useContext, useRef, useState } from "react";
import { Euler, Mesh, Vector3 } from "three";
import { letterAnimation } from "./letter-animations";
import { LetterAnimationContext } from "./scene-hill";

const FONT_SEAMLESS = "/bundles/asm-graphics/shared/fonts/seamless/Seamless_Regular.json";
const FONT_RUSSOONE = "/bundles/asm-graphics/shared/fonts/russo-one/Russo One_Regular.json";
const FONT_NOTOSANS_REGULAR = "/bundles/asm-graphics/shared/fonts/noto-sans/Noto Sans_Regular.json";
const FONT_NOTOSANS_BOLD = "/bundles/asm-graphics/shared/fonts/noto-sans/Noto Sans_Bold.json";

const DEG_TO_RAD = Math.PI / 180;

export type AvailableFonts = "Seamless" | "Russo One" | "Noto Sans" | "Noto Sans Bold";

function getFont(font: AvailableFonts) {
	switch (font) {
		case "Seamless":
			return FONT_SEAMLESS;
		case "Russo One":
			return FONT_RUSSOONE;
		case "Noto Sans Bold":
			return FONT_NOTOSANS_BOLD;
		case "Noto Sans":
		default:
			return FONT_NOTOSANS_REGULAR;
	}
}

function addVectors(a: Vector3, b: Vector3) {
	return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

const baseRotation = new Vector3(-10 * DEG_TO_RAD, -15 * DEG_TO_RAD, 0);

export type TextEvent = {
	position: Vector3;
	time: number;
};

type LetterProps = {
	letter: string;
	font: AvailableFonts;
	position: [number, number, number];
	doAnimation?: boolean;
} & Omit<React.ComponentProps<typeof Text3D>, "font" | "position">;

export const Letter = (props: LetterProps) => {
	const letterRef = useRef<Mesh>(null);
	const letterAnimationOccurance = useContext(LetterAnimationContext);
	const worldPos = new Vector3();

	useFrame(({ clock }) => {
		if (!letterRef.current || !letterAnimationOccurance || !props.doAnimation) return;

		letterRef.current.getWorldPosition(worldPos);

		// if (letterAnimationOccurance.time < 0) {
		// 	const animation = letterAnimation("constant-jump")((clock.getElapsedTime() + mulberry32(worldPos.x * 1000)()) % 1);
		// 	letterRef.current.position.set(
		// 		(animation[0].x + props.position[0]) * letterRef.current.scale.x,
		// 		(animation[0].y + props.position[1]) * letterRef.current.scale.y,
		// 		(animation[0].z + props.position[2]) * letterRef.current.scale.z,
		// 	);
		// 	return;
		// }
		const distanceToOccurance = worldPos.distanceTo(
			new Vector3(
				letterAnimationOccurance.position[0],
				letterAnimationOccurance.position[1],
				letterAnimationOccurance.position[2],
			),
		);

		const startTime = (distanceToOccurance * 0.5 - 0.5) + letterAnimationOccurance.time;
		const animation = letterAnimation("jump")(clock.getElapsedTime() - startTime);
		letterRef.current.position.set(
			(animation[0].x + props.position[0]) * letterRef.current.scale.x,
			(animation[0].y + props.position[1]) * letterRef.current.scale.y,
			(animation[0].z + props.position[2]) * letterRef.current.scale.z,
		);

		letterRef.current.rotation.setFromVector3(addVectors(animation[1], baseRotation));
	});

	return (
		<Text3D
			{...props}
			font={getFont(props.font)}
			rotation={[baseRotation.x, baseRotation.y, baseRotation.z]}
			position={props.position}
			ref={letterRef}>
			{props.letter}
			<textMaterial />
		</Text3D>
	);
};

function mulberry32(a: number) {
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		var t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
