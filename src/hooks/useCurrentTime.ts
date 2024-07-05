import { useState, useEffect } from "react";

function useCurrentTime(updateInterval = 1000) {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date());
		}, updateInterval);

		return () => {
			clearInterval(intervalId);
		};
	}, [updateInterval]);

	return time;
}

export function useNormalisedTime(updateInterval = 1000) {
	const [normalisedTime, setNormalisedTime] = useState(calculateNormalisedTime());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setNormalisedTime(calculateNormalisedTime());
		}, updateInterval);

		return () => {
			clearInterval(intervalId);
		};
	}, [updateInterval]);

	function calculateNormalisedTime() {
		const currentTime = new Date();
		const hours = currentTime.getHours();
		const minutes = currentTime.getMinutes();
		const seconds = currentTime.getSeconds();

		const totalSeconds = hours * 3600 + minutes * 60 + seconds;
		const normalisedTime = (totalSeconds / (24 * 3600) + 0.5) % 1;

		return normalisedTime;
	}

	return normalisedTime;
}

export default useCurrentTime;
