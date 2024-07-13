import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Euler, Mesh, Vector3 } from "three";
import { letterAnimation } from "./asm-24/letter-animations";

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

type LetterProps = {
	letter: string;
	font: AvailableFonts;
	position: [number, number, number];
} & Omit<React.ComponentProps<typeof Text3D>, "font" | "position">;

export const Letter = (props: LetterProps) => {
	const letterRef = useRef<Mesh>(null);
	// const [centre] = useState<Vector3>(new Vector3());
	// const [centreSet, setCentreSet] = useState(false);

	// useFrame(({ clock }) => {
	// 	if (!letterRef.current) return;

	// 	// if (!centreSet) {
	// 	// 	const boundingBox = letterRef.current.geometry.boundingBox;
	// 	// 	boundingBox?.getCenter(centre);
	// 	// 	setCentreSet(true);
	// 	// }

	// 	// letterRef.current.geometry.center();

	// 	const animation = letterAnimation("jump")(clock.getElapsedTime() % 1);
	// 	letterRef.current.position.set(
	// 		(animation[0].x + props.position[0]) * letterRef.current.scale.x,
	// 		(animation[0].y + props.position[1]) * letterRef.current.scale.y,
	// 		(animation[0].z + props.position[2]) * letterRef.current.scale.z,
	// 	);



	// 	letterRef.current.rotation.setFromVector3(addVectors(animation[1], baseRotation));
	// });

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
