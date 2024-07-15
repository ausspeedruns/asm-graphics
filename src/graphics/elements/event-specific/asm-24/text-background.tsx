import { Plane, useTexture } from "@react-three/drei";
import { ComponentProps } from "react";
import { Color, Texture } from "three";

import backgroundBlurTexture from "./assets/BackgroundBlur.png";

type TextBackground = {} & ComponentProps<typeof Plane>;

export const TextBackground = (props: TextBackground) => {
	const texture = useTexture(backgroundBlurTexture) as Texture;
	return (
		<Plane {...props}>
			<meshBasicMaterial transparent opacity={1} map={texture} color={new Color(0x030c38)} />
		</Plane>
	);
};
