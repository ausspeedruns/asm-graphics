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

export default useCurrentTime;
