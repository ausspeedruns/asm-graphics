import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { format } from "date-fns";

const CurrentTimeArea = styled.div`
	height: 100%;
	width: fit-content;
	background: var(--sec);
	color: var(--text-light);
	font-weight: bold;
	/* border-left: 6px solid var(--accent); */
	padding: 0 16px;
	text-transform: uppercase;
	font-size: 22px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 4px;
	line-height: 20px;
	font-family: var(--mono-font);
`;

export function CurrentTime() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<CurrentTimeArea>
			<span>{format(currentTime, "h:mm a")}</span>
			<span>{format(currentTime, "E d")}</span>
		</CurrentTimeArea>
	);
}
