import { Plane, useTexture } from "@react-three/drei";
import { ComponentProps } from "react";
import { Color, Texture } from "three";

import backgroundBlurTexture from "./assets/BackgroundBlur.png";
import { lightValue } from "./time-utils";

type TextBackground = {
	time?: number;
} & ComponentProps<typeof Plane>;

const colour = new Color(0x030c38);

export const TextBackground = (props: TextBackground) => {
	const texture = useTexture(backgroundBlurTexture) as Texture;
	return (
		<Plane {...props}>
			<meshBasicMaterial map={texture} transparent fog={false} color={colour} opacity={lightValue(props.time ?? 1)} />
		</Plane>
	);
};
