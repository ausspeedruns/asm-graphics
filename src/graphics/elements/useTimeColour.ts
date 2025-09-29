import { useNormalisedTime } from "../../hooks/useCurrentTime";

interface ColourSwatch {
	plasticTop: string;
	plasticBottom: string;
	textOutline: string;
	trace: string;
	traceOutline: string;
	chip: string;
}

export const dayTimeColours: ColourSwatch = {
	plasticTop: "#4A85DE",
	plasticBottom: "#437c90",
	textOutline: "#CC7722",
	trace: "#A0F5FF",
	traceOutline: "#113C63",
	chip: "#8CA7FE",
};

const sunsetTimeColours: ColourSwatch = {
	plasticTop: "#ffa178",
	plasticBottom: "#ffbf7e",
	textOutline: "#8574b8",
	trace: "#ffd3a0",
	traceOutline: "#83180a",
	chip: "#f2aeae",
};

const sunriseTimeColours: ColourSwatch = {
	plasticTop: "#c5a0f2",
	plasticBottom: "#f79fff",
	textOutline: "#cc7722",
	trace: "#cca0ff",
	traceOutline: "#483a72",
	chip: "#918da9",
};

const nightTimeColours: ColourSwatch = {
	plasticTop: "#2b2b2b",
	plasticBottom: "#202020",
	textOutline: "#309128",
	trace: "#d7ffa0",
	traceOutline: "#011d03",
	chip: "#918da9",
};

export const sunsetStart = 0.2203; // 5:23 PM
export const sunsetEnd = 0.2646; // 6:21 PM
export const sunriseStart = 0.7646; // 6:21 AM
export const sunriseEnd = 0.8125; // 7:30 AM

const timeColourTimeline = [
	{ time: 0.0, colours: dayTimeColours },
	{ time: sunsetStart, colours: dayTimeColours },
	{ time: (sunsetStart + sunsetEnd) / 2, colours: sunsetTimeColours },
	{ time: sunsetEnd, colours: nightTimeColours },
	{ time: sunriseStart, colours: nightTimeColours },
	{ time: (sunriseStart + sunriseEnd) / 2, colours: sunriseTimeColours },
	{ time: sunriseEnd, colours: dayTimeColours },
] as const;

const allKeyframes = timeColourTimeline.map((keyframe) => keyframe.time);

function lerpColourSwatch(swatchA: ColourSwatch, swatchB: ColourSwatch, t: number): ColourSwatch {
	return {
		plasticTop: lerp(swatchA.plasticTop, swatchB.plasticTop, t),
		plasticBottom: lerp(swatchA.plasticBottom, swatchB.plasticBottom, t),
		textOutline: lerp(swatchA.textOutline, swatchB.textOutline, t),
		trace: lerp(swatchA.trace, swatchB.trace, t),
		traceOutline: lerp(swatchA.traceOutline, swatchB.traceOutline, t),
		chip: lerp(swatchA.chip, swatchB.chip, t),
	};
}

function lerp(a: string, b: string, t: number): string {
	const aRGB = parseInt(a.slice(1), 16);
	const bRGB = parseInt(b.slice(1), 16);

	const r = Math.round((aRGB >> 16) * (1 - t) + (bRGB >> 16) * t);
	const g = Math.round(((aRGB >> 8) & 0xff) * (1 - t) + ((bRGB >> 8) & 0xff) * t);
	const bValue = Math.round((aRGB & 0xff) * (1 - t) + (bRGB & 0xff) * t);

	return `#${((1 << 24) + (r << 16) + (g << 8) + bValue).toString(16).slice(1).toUpperCase()}`;
}

export function normalisedTimeToColour(normalisedTime: number): ColourSwatch {
	let colours = dayTimeColours;

	for (let i = 0; i < allKeyframes.length - 1; i++) {
		const keyframeA = allKeyframes[i];

		// Check if we are at the end of the timeline
		if (i === allKeyframes.length - 1) {
			colours = timeColourTimeline[i].colours;
			break;
		}

		const keyframeB = allKeyframes[i + 1];

		if (normalisedTime >= keyframeA && normalisedTime <= keyframeB) {
			const t = (normalisedTime - keyframeA) / (keyframeB - keyframeA);
			colours = lerpColourSwatch(timeColourTimeline[i].colours, timeColourTimeline[i + 1].colours, t);
			break;
		}
	}

	return colours;
}

export function useTimeColour(updateInterval = 1000): ColourSwatch {
	const normalisedTime = useNormalisedTime(updateInterval);
	return normalisedTimeToColour(normalisedTime);
}
