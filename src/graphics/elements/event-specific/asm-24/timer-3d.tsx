import { BBAnchor, Box, Center } from "@react-three/drei";
import type { Timer as TimerType } from "@asm-graphics/types/Timer";
import { ASRText } from "./letter-rotation";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Stopwatch } from "./stopwatch";
import { DEG2RAD } from "three/src/math/MathUtils";

function calculateTimeWidth(stringLength: number) {
	// We know that if the string is 5 characters then it's 00:00
	if (stringLength === 5) {
		return 1.2;
	}

	// If the string is 7 characters it's 0:00:00
	if (stringLength === 7) {
		return 1.5;
	}

	// If the string is 8 characters it's 00:00:00
	if (stringLength === 8) {
		return 1.6;
	}

	return 0;
}

function stopwatchXPosition(stringLength: number) {
	// We know that if the string is 5 characters then it's 00:00
	if (stringLength === 5) {
		return -1.3;
	}

	// If the string is 7 characters it's 0:00:00
	if (stringLength === 7) {
		return -1.6;
	}

	// If the string is 8 characters it's 00:00:00
	if (stringLength === 8) {
		return -1.75;
	}

	return 0;
}

type TimerProps = {
	timer?: TimerType;
	fontSize?: number;
} & React.ComponentProps<typeof Center>;

export const Timer3D = (props: TimerProps) => {
	const centerRef = useRef<THREE.Group>(null);
	// const mainTimeRef = useRef<THREE.Group>(null);
	const millisRef = useRef<THREE.Group>(null);

	// const [previousLength, setPreviousLength] = useState(5);

	let millis = 0;
	if (props.timer) {
		millis = Math.floor((props.timer?.milliseconds % 1000) / 100);
	}

	// A run over 10 hours though possible is unlikely for now
	let compressedTime = props?.timer?.time ?? "00:00:00";
	// let compressedTime = "0:00:00";
	if ((props?.timer?.milliseconds ?? 0) < 3600000) {
		// Remove hours while under 1 hour
		compressedTime = compressedTime?.substring(3);
	} else if ((props?.timer?.milliseconds ?? 0) < 36000000) {
		// Remove 10's hours while under 10 hours, this would be interesting if it ever got here tho, some Final Fanstasy shit
		compressedTime = compressedTime?.substring(1);
	}

	const timeLength = compressedTime.length;

	// useEffect(() => {
	// 	console.log("TIMER UPDATING!!!", mainTimeRef.current, millisRef.current, timeLength);
	// 	if (mainTimeRef.current && millisRef.current) {
	// 		const bb = new THREE.Box3();
	// 		bb.setFromObject(mainTimeRef.current);
	// 		let boundingBoxSize = new THREE.Vector3();
	// 		bb.getSize(boundingBoxSize);
	// 		millisRef.current.position.set(boundingBoxSize.x - 0.05, -0.17, 0);
	// 	}
	// }, [mainTimeRef.current, millisRef.current, timeLength]);

	// useEffect(() => {
	// 	if (millisRef.current) {
	// 		millisRef.current.position.set(calculateTimeWidth(timeLength), -0.17, 0);
	// 	}
	// }, [props.timer, millisRef.current, timeLength]);

	return (
		<Center {...props} ref={centerRef} cacheKey={timeLength}>
			<Stopwatch
				time={props.timer?.milliseconds}
				position={[stopwatchXPosition(timeLength), 0, 0]}
				scale={4}
				rotation={[-15 * DEG2RAD, -10 * DEG2RAD, 0]}
			/>
			<ASRText text={compressedTime} font={"Seamless"} dontUpdateCenter cacheKey={timeLength} />
			<ASRText
				text={`.${millis}`}
				font={"Seamless"}
				scale={0.5}
				ref={millisRef}
				position={[calculateTimeWidth(timeLength), -0.17, 0]}
				dontUpdateCenter
				cacheKey={timeLength}
			/>
		</Center>
	);
};

//
