
export const sunsetStart = 0.2203; // 5:23 PM
export const sunsetEnd = 0.2646; // 6:21 PM
export const sunriseStart = 0.7646; // 6:21 AM
export const sunriseEnd = 0.8125; // 7:30 AM

export function lightValue(time: number = 0) {
	if (time < sunsetStart || time > sunriseEnd) {
		return 1;
	} else if (time < sunsetEnd) {
		return 1 - (time - sunsetStart) / (sunsetEnd - sunsetStart);
	} else if (time < sunriseStart) {
		return 0;
	} else {
		return (time - sunriseStart) / (sunriseEnd - sunriseStart);
	}
}

// function timeToFloat(hours, minutes) {
// 	return (hours / 24 + minutes / 24 / 60 + 0.5) % 1;
// }
