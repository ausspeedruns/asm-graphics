import type { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { format } from "date-fns";
import type { ReactNode } from "react";
import { styled } from "styled-components";
import { RunnerNames } from "../runner-names";
import { FitText } from "../../../elements/fit-text";

const ASAP25UpcomingRunContainer = styled.div`
	display: flex;
`;

const TimeText = styled.div`
	width: 200px;
	text-align: right;
	font-weight: bold;
`;

const ASAP2025Dot = styled.div`
	height: 15px;
	width: 15px;
	background: #000000;
	border-radius: 50%;
	z-index: 10;
`;

interface Props {
	run: RunDataActiveRun;
	players?: ReactNode[];
	isNext?: boolean;
}

export function ASAP25UpcomingRun(props: Props) {
	return (
		<ASAP25UpcomingRunContainer style={{ fontSize: props.isNext ? 36 : 24 }}>
			{/* Time */}
			<TimeText>
				{props.isNext ? "UP NEXT" : props.run?.scheduled ? format(props.run?.scheduled, "h:mm a") : "??:??"}
			</TimeText>

			{/* Dot */}
			<ASAP2025Dot style={{ marginTop: props.isNext ? 18 : 10, marginLeft: props.isNext ? 15 : 13 }} />
			{/* Run Info */}
			<div style={{ marginLeft: 20, display: "flex", flexDirection: "column" }}>
				<FitText style={{ fontWeight: 900, maxWidth: 500 }} text={props.run?.game} alignment="left" />
				<FitText text={props.run?.category} style={{ maxWidth: 500 }} alignment="left" />
				<div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
					<RunnerNames run={props.run} alignment="left" />
				</div>
			</div>
		</ASAP25UpcomingRunContainer>
	);
}
