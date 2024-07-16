import { Vector3 } from "three";

type AnimationTuple = [translate: Vector3, rotate: Vector3, scale: Vector3];

const DEG_TO_RAD = Math.PI / 180;

export function letterAnimation(animation: "jump" | "constant-jump"): (time: number) => AnimationTuple {
	switch (animation) {
		case "jump":
			return jump;
		case "constant-jump":
			return constantJump;
	}
}

const letterJumpHeight = 0.2;
const letterRotation = 360;

function constantJump(t: number): AnimationTuple {
	let translate = new Vector3();
	let rotation = new Vector3();

	translate.y = (-letterJumpHeight / 0.25) * Math.pow(t - 0.5, 2) + letterJumpHeight;

	// rotation.y = (-letterRotation * Math.pow(t - 1, 2) + letterRotation) * DEG_TO_RAD;

	return [translate, rotation, new Vector3()];
}

const amplitude = 1;
const xOffset = 0.5;
const duration = 0.2;

function jump(t: number): AnimationTuple {
	let translate = new Vector3();
	let rotation = new Vector3();

	// translate.y = (-letterJumpHeight / 0.25) * Math.pow(t - 0.5, 2) + letterJumpHeight;
	translate.y = Math.pow(amplitude * Math.E, -(Math.pow(t - xOffset, 2) / (duration * duration)));

	// rotation.y = (-letterRotation * Math.pow(t - 1, 2) + letterRotation) * DEG_TO_RAD;

	return [translate, rotation, new Vector3()];
}
