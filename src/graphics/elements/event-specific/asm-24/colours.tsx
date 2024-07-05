// File is TSX so that VSCode shows the colours in the editor

import { Color } from "three";
import { lightValue } from "./time-utils";

export const nightTint = new Color(0x817ec2); // #817ec2

const white = new Color(0xffffff);

export function timeOfDayTint(time: number = 0) {
	return new Color().lerpColors(nightTint, white, lightValue(time));
}
