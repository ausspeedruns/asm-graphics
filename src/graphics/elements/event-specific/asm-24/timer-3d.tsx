import { BBAnchor, Box, Center } from "@react-three/drei";
import type { Timer as TimerType } from "@asm-graphics/types/Timer";
import { ASRText } from "./letter-rotation";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Stopwatch } from "./stopwatch";
import { DEG2RAD } from "three/src/math/MathUtils";

function calculateTimeWidth(stringLength: number, hour: number) {
	// We know that if the string is 5 characters then it's 00:00
	if (stringLength === 5) {
		return 1.2;
	}

	// If the string is 7 characters it's 0:00:00
	if (stringLength === 7) {
		if (hour == 1) {
			return 1.4;
		} else {
			return 1.5;
		}
	}

	// If the string is 8 characters it's 00:00:00
	if (stringLength === 8) {
		return 1.6;
	}

	return 0;
}

function stopwatchXPosition(stringLength: number, hour: number) {
	// We know that if the string is 5 characters then it's 00:00
	if (stringLength === 5) {
		return -1.3;
	}

	// If the string is 7 characters it's 0:00:00
	if (stringLength === 7) {
		if (hour === 1) {
			return -1.5;
		} else {
			return -1.6;
		}
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

function getHour(ms: number) {
	return Math.floor(ms / (1000 * 60 * 60));
}

export const Timer3D = (props: TimerProps) => {
	const centerRef = useRef<THREE.Group>(null);
	// const mainTimeRef = useRef<THREE.Group>(null);
	const millisRef = useRef<THREE.Group>(null);
	// const [centerCacheKey, setCenterCacheKey] = useState("5-false");

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

	const hour = getHour(props.timer?.milliseconds ?? 0);
	const timeCacheKey = `${compressedTime.length}-${hour}`;

	// useEffect(() => {
	// 	if (timeLength.toString() !== centerCacheKey[0]) {
	// 		setCenterCacheKey(`${timeLength}-false`);
	// 	}

	// 	if (timeLength.toString() === centerCacheKey[0]) {
	// 		setCenterCacheKey(`${timeLength}-true`);
	// 	}
	// }, [timeLength, centerCacheKey])

	console.log(timeCacheKey);

	return (
		<group {...props} ref={centerRef}>
			<Stopwatch
				time={props.timer?.milliseconds}
				position={[stopwatchXPosition(compressedTime.length, hour), 0, 0]}
				scale={4}
				rotation={[-15 * DEG2RAD, -10 * DEG2RAD, 0]}
			/>
			<ASRText
				doAnimation={false}
				text={compressedTime}
				font={"Seamless"}
				dontUpdateCenter
				cacheKey={timeCacheKey}
			/>
			<ASRText
				doAnimation={false}
				text={`.${millis}`}
				font={"Seamless"}
				scale={0.5}
				ref={millisRef}
				position={[calculateTimeWidth(compressedTime.length, hour), -0.17, 0]}
				dontUpdateCenter
				cacheKey={compressedTime.length}
			/>
		</group>
	);
};

//
