import { Vector3 } from "three";

type AnimationTuple = [translate: Vector3, rotate: Vector3, scale: Vector3];

const DEG_TO_RAD = Math.PI / 180;

export function letterAnimation(animation: "jump"): (time: number) => AnimationTuple {
	switch (animation) {
		case "jump":
			return jump;
	}
}

const letterJumpHeight = 0.5;
const letterRotation = 360;
function jump(t: number): AnimationTuple {
	let translate = new Vector3();
	let rotation = new Vector3();

	translate.y = (-letterJumpHeight / 0.25) * Math.pow(t - 0.5, 2) + letterJumpHeight;

	rotation.y = (-letterRotation * Math.pow(t - 1, 2) + letterRotation) * DEG_TO_RAD;

	return [translate, rotation, new Vector3()];
}
