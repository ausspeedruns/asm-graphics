import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { format, formatDistanceStrict } from "date-fns";
import { useReplicant } from "@nodecg/react-hooks";

import type { Timer } from "@asm-graphics/types/Timer";

import useSurroundingRuns from "@asm-graphics/shared/hooks/useSurroundingRuns";
import useCurrentTime from "@asm-graphics/shared/hooks/useCurrentTime";

const DashRunInformationContainer = styled.div``;

const Header = styled.h1`
	margin: 8px;
	text-align: center;
`;

const RunContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const RunInfo = styled.span``;

export const DashRunInformation = () => {
	const [_, currentRun, nextRun] = useSurroundingRuns();

	return (
		<DashRunInformationContainer>
			<RunContainer>
				<Header>Current Run</Header>
				<RunInfo>{currentRun?.game}</RunInfo>
				<RunInfo>{currentRun?.category}</RunInfo>
				<RunInfo>
					{currentRun?.teams.flatMap((team) => team.players.map((player) => player.name)).join(", ")}
				</RunInfo>
				<RunInfo>{currentRun?.customData.techPlatform}</RunInfo>
				<RunInfo>{currentRun?.customData.specialRequirements}</RunInfo>
				{nextRun?.customData.exitTransition && (
					<RunInfo>Exit Transition: {nextRun?.customData.exitTransition}</RunInfo>
				)}
			</RunContainer>
			<Header>Timing</Header>
			<Timings />
			<RunContainer>
				<Header>Next Run</Header>
				<RunInfo>{nextRun?.game}</RunInfo>
				<RunInfo>{nextRun?.category}</RunInfo>
				<RunInfo>
					{nextRun?.teams.flatMap((team) => team.players.map((player) => player.name)).join(", ")}
				</RunInfo>
				<RunInfo>{nextRun?.customData.techPlatform}</RunInfo>
				<RunInfo>{nextRun?.customData.specialRequirements}</RunInfo>
				{nextRun?.customData.exitTransition && (
					<RunInfo>Entry Transition: {nextRun?.customData.entryTransition}</RunInfo>
				)}
			</RunContainer>
		</DashRunInformationContainer>
	);
};

const TimingsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
`;

const TimingContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 1px solid #ffffff8d;
	border-radius: 4px;
	padding: 8px;
`;

const TimingLabel = styled.span`
	font-weight: bold;
	font-size: 1.2rem;
`;

const TimingContent = styled.div`
	display: flex;
	flex-grow: 1;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const Timings = () => {
	const [timerRep] = useReplicant<Timer>("timer", { bundle: "nodecg-speedcontrol" });
	const [_, currentRun, nextRun] = useSurroundingRuns();
	const currentTime = useCurrentTime(500);

	const runStartDate = currentTime.getTime() - (timerRep?.milliseconds ?? 0);

	const runStartTime = timerRep?.milliseconds ? format(runStartDate, "h:mm b") : "Run not started";

	const differenceTime = currentRun?.scheduledS
		? formatDistanceStrict(runStartDate, currentRun?.scheduledS * 1000, { roundingMethod: "ceil", unit: "minute" })
		: "No scheduled start time on run";

	const estimatedRunEnd =
		timerRep?.milliseconds && currentRun?.estimateS
			? format(runStartDate + currentRun?.estimateS * 1000, "h:ss b")
			: "Run not started";

	const nextRunTime = nextRun?.scheduledS ? format(nextRun.scheduledS * 1000, "h:mm b") : "No next run";

	return (
		<TimingsContainer>
			<TimingContainer>
				<TimingLabel>Run Started at</TimingLabel>
				<TimingContent>
					<span>{runStartTime}</span>
				</TimingContent>
			</TimingContainer>
			<TimingContainer>
				<TimingLabel>We are currently</TimingLabel>
				<TimingContent>
					<span>{differenceTime}</span>
					<span>
						{currentRun?.scheduledS
							? runStartDate <= currentRun?.scheduledS * 1000
								? "AHEAD"
								: "BEHIND"
							: "No run"}
					</span>
				</TimingContent>
			</TimingContainer>
			<TimingContainer>
				<TimingLabel>Estimated end</TimingLabel>
				<TimingContent>
					<span>{estimatedRunEnd}</span>
				</TimingContent>
			</TimingContainer>
			<TimingContainer>
				<TimingLabel>Next run</TimingLabel>
				<TimingContent>
					<span>{nextRunTime}</span>
				</TimingContent>
			</TimingContainer>
		</TimingsContainer>
	);
};

createRoot(document.getElementById("root")!).render(<DashRunInformation />);
