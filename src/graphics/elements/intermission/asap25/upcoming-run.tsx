import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { format } from "date-fns";
import { styled } from "styled-components";

const ASAP25UpcomingRunContainer = styled.div`
	display: flex;
`;

const TimeText = styled.div`
	width: 100px;
	text-align: right;
`;

interface Props {
	run: RunDataActiveRun;
	isNext?: boolean;
}

export function ASAP25UpcomingRun(props: Props) {
	return (
		<ASAP25UpcomingRunContainer>
			{/* Time */}
			<TimeText>
				{props.isNext ? "Up Next" : props.run?.scheduled ? format(props.run?.scheduled, "h:mm a") : "??:??"}
			</TimeText>

			{/* Dot */}
			{/* Run Info */}
		</ASAP25UpcomingRunContainer>
	)
}
