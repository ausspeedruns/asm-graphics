import React from "react";
import { Center } from "@react-three/drei";
import { ASRText } from "./letter-rotation";
import type { RunData } from "@asm-graphics/types/RunData";

type TimerProps = {
	estimate?: RunData["estimate"];
} & React.ComponentProps<typeof Center>;

export const Estimate3D = (props: TimerProps) => {
	let formattedEstimate = props.estimate ?? "0:00:00";

	if (formattedEstimate[0] === "0" && formattedEstimate[1] !== ":") {
		formattedEstimate = formattedEstimate.substring(1);
	}

	return (
		<Center {...props}>
			<group>
				<ASRText text="EST" font="Noto Sans" scale={0.7} position={[-1.6, -0.055, 0]} />
				<ASRText text={formattedEstimate} font="Noto Sans" />
			</group>
		</Center>
	);
};
