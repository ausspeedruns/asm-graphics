import { useContext } from "react";

import { TimeStyleContext, type TimeStyleContextValue } from "./time-style-context";

export function useTimeStyleContext(): TimeStyleContextValue {
	const context = useContext(TimeStyleContext);
	if (!context) {
		throw new Error("useTimeStyleContext must be used within a TimeStyleProvider");
	}

	return context;
}
