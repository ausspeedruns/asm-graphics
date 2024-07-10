// File is TSX so that VSCode shows the colours in the editor

import { Color } from "three";
import { lightValue, sunriseEnd, sunriseStart, sunsetEnd, sunsetStart } from "./time-utils";

export const nightTint = new Color("#817ec2");

const white = new Color("#ffffff");

export function timeOfDayTint(time: number = 0) {
	return new Color().lerpColors(nightTint, white, lightValue(time));
}

const daylight = new Color("#0054c4");
const sunset = new Color("#cc7722");
const night = new Color("#0b193f");
const sunrise = new Color("#e8756c");

export function uiTime(time: number = 0): string {
	if (time <= sunsetStart || time >= sunriseEnd) {
		return daylight.getHexString();
	} else if (time <= sunsetEnd) {
		const t = mapNumRange(time, sunsetStart, sunsetEnd, 0, 2);

		if (t < 1) {
			return new Color().lerpColors(daylight, sunset, t).getHexString();
		} else {
			return new Color().lerpColors(sunset, night, t - 1).getHexString();
		}
	} else if (time <= sunriseStart) {
		return night.getHexString();
	} else {
		// const t = (time - sunriseStart) / (sunriseEnd - sunriseStart);
		const t = mapNumRange(time, sunriseStart, sunriseEnd, 0, 2);

		if (t < 1) {
			return new Color().lerpColors(night, sunrise, t).getHexString();
		} else {
			return new Color().lerpColors(sunrise, daylight, t - 1).getHexString();
		}
	}
}

function mapNumRange(num: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
