import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { Colour } from "../colour";

export interface TimeStyleContextValue {
	normalizedTime: number;
	isManualControlEnabled: boolean;
	daylightData: DaylightData;
	setManualNormalizedTime: (value: number) => void;
	clearManualNormalizedTime: () => void;
}

interface DaylightData {
	sunrise: {
		start: number;
		end: number;
	};
	sunset: {
		start: number;
		end: number;
	};
}

interface TwilightData {
	astronomicalMorningStart: string;
	civilMorningEnd: string;
	daylightEveningEnd: string;
	astronomicalEveningEnd: string;
}

const MINUTES_PER_DAY = 24 * 60;

const TWILIGHT_DATA = {
	astronomicalMorningStart: "5:51 am",
	civilMorningEnd: "7:22 am",
	daylightEveningEnd: "5:11 pm",
	astronomicalEveningEnd: "6:41 pm",
} as const satisfies TwilightData;

export const TimeStyleContext = createContext<TimeStyleContextValue | undefined>(undefined);

function parseTimeToMinutes(value: string): number {
	const parts = value.trim().toLowerCase().split(" ");
	const time = parts[0];
	const period = parts[1];
	if (!time || (period !== "am" && period !== "pm")) {
		throw new Error(`Invalid time format: ${value}`);
	}

	const [hoursString, minutesString] = time.split(":");
	if (!hoursString || !minutesString) {
		throw new Error(`Invalid time format: ${value}`);
	}

	const hours = Number.parseInt(hoursString, 10);
	const minutes = Number.parseInt(minutesString, 10);

	let normalizedHours = hours % 12;
	if (period === "pm") {
		normalizedHours += 12;
	}

	return normalizedHours * 60 + minutes;
}

function minutesToNormalized(minutes: number): number {
	return minutes / MINUTES_PER_DAY;
}

function getCurrentNormalizedTime(now: Date): number {
	const minutes = now.getHours() * 60 + now.getMinutes();
	const seconds = now.getSeconds();
	const milliseconds = now.getMilliseconds();
	const totalMinutes = minutes + seconds / 60 + milliseconds / 60000;

	return totalMinutes / MINUTES_PER_DAY;
}

// 1 is night mode, 0 is day mode
export function calculateNightT(value: number, daylightData: DaylightData) {
	let t: number;

	if (value > daylightData.sunrise.end && value < daylightData.sunset.start) {
		t = 0;
	} else if (value >= daylightData.sunrise.start && value <= daylightData.sunrise.end) {
		t = (value - daylightData.sunrise.start) / (daylightData.sunrise.end - daylightData.sunrise.start);
	} else if (value >= daylightData.sunset.start && value <= daylightData.sunset.end) {
		t = (value - daylightData.sunset.start) / (daylightData.sunset.end - daylightData.sunset.start);
	} else {
		t = 1;
	}

	return t;
}

const dayColour = new Colour("#ce762f");
const nightColour = new Colour("#380049");

export function calculateTimeBasedColour(
	value: number,
	daylightData: DaylightData,
	colourData: {
		day: Colour;
		night: Colour;
	},
) {
	let colour: string;

	// Start at day colour
	if (value > daylightData.sunrise.end && value < daylightData.sunset.start) {
		colour = colourData.day.hex;
	} else if (value >= daylightData.sunrise.start && value <= daylightData.sunrise.end) {
		// Sunrise transition
		const t = (value - daylightData.sunrise.start) / (daylightData.sunrise.end - daylightData.sunrise.start);
		colour = colourData.day.lerp(colourData.night, 1 - t).hex;
	} else if (value >= daylightData.sunset.start && value <= daylightData.sunset.end) {
		// Sunset transition
		const t = (value - daylightData.sunset.start) / (daylightData.sunset.end - daylightData.sunset.start);
		colour = colourData.night.lerp(colourData.day, 1 - t).hex;
	} else {
		colour = colourData.night.hex;
	}

	return colour;
}

export function TimeStyleProvider({ children }: PropsWithChildren) {
	const [liveNormalizedTime, setLiveNormalizedTime] = useState<number>(() => getCurrentNormalizedTime(new Date()));
	const [manualNormalizedTime, setManualNormalizedTimeState] = useState<number | null>(null);

	const sunriseStart = useMemo(
		() => minutesToNormalized(parseTimeToMinutes(TWILIGHT_DATA.astronomicalMorningStart)),
		[],
	);
	const sunriseEnd = useMemo(() => minutesToNormalized(parseTimeToMinutes(TWILIGHT_DATA.civilMorningEnd)), []);
	const sunsetStart = useMemo(() => minutesToNormalized(parseTimeToMinutes(TWILIGHT_DATA.daylightEveningEnd)), []);
	const sunsetEnd = useMemo(() => minutesToNormalized(parseTimeToMinutes(TWILIGHT_DATA.astronomicalEveningEnd)), []);

	const normalizedTime = manualNormalizedTime ?? liveNormalizedTime;
	const isManualControlEnabled = manualNormalizedTime !== null;

	const daylightData = useMemo<DaylightData>(
		() => ({
			sunrise: {
				start: sunriseStart,
				end: sunriseEnd,
			},
			sunset: {
				start: sunsetStart,
				end: sunsetEnd,
			},
		}),
		[sunriseStart, sunriseEnd, sunsetStart, sunsetEnd],
	);

	function setManualNormalizedTime(value: number): void {
		const clampedValue = Math.max(0, Math.min(1, value));
		setManualNormalizedTimeState(clampedValue);
	}

	function clearManualNormalizedTime(): void {
		setManualNormalizedTimeState(null);
	}

	useEffect(() => {
		if (manualNormalizedTime !== null) {
			return;
		}

		const interval = setInterval(() => {
			setLiveNormalizedTime(getCurrentNormalizedTime(new Date()));
		}, 1000);

		return () => clearInterval(interval);
	}, [manualNormalizedTime]);

	useEffect(() => {
		const baseColour = calculateTimeBasedColour(normalizedTime, daylightData, {
			day: dayColour,
			night: nightColour,
		});

		if (!baseColour) return;

		document.documentElement.style.setProperty("--time-colour", baseColour);
	}, [normalizedTime, daylightData]);

	const value = useMemo<TimeStyleContextValue>(
		() => ({
			normalizedTime,
			isManualControlEnabled,
			daylightData,
			setManualNormalizedTime,
			clearManualNormalizedTime,
		}),
		[normalizedTime, isManualControlEnabled, daylightData],
	);

	return <TimeStyleContext.Provider value={value}>{children}</TimeStyleContext.Provider>;
}
