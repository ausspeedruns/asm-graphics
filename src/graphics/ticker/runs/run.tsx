import styled from "@emotion/styled";
import type { RunData } from "@asm-graphics/types/RunData";

const TickerItemContainer = styled.div`
	height: 64px;
	width: fit-content;
	font-family: var(--main-font);
	color: var(--text-light);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	line-height: 1;
`;

const VerticalStack = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 0 12px;
	height: 100%;
`;

const Title = styled.span`
	font-size: 28px;
	white-space: nowrap;
	font-weight: 1000;
	font-family: var(--secondary-font);
	/* height: 60%; */
	/* margin-bottom: -8px; */
`;

const Subtitle = styled.span`
	font-size: 17px;
	white-space: nowrap;
	/* height: 40%; */
	/* font-family: var(--secondary-font); */
`;

interface RunProps {
	run: RunData;
}

export function Run(props: RunProps) {
	let timeUntilRun = 0;

	if (props.run.scheduledS) {
		timeUntilRun = props.run.scheduledS - Math.floor(Date.now() / 1000);
	}

	let playerNames: string;
	if (props.run.teams.length === 0) {
		playerNames = "";
	} else {
		playerNames = props.run.teams
			.map((team) => {
				return team.players.map((player) => player.name).join(", ");
			})
			.join(" vs ");
	}

	return (
		<TickerItemContainer>
			<VerticalStack>
				<Title>{props.run.game ?? ""}</Title>
				<Subtitle>
					<b>{approximateTimeFormatter(timeUntilRun)}</b> – {playerNames}
				</Subtitle>
			</VerticalStack>
		</TickerItemContainer>
	);
}

function approximateTimeFormatter(time: number): string {
	const days = Math.floor(time / 86400);
	const hours = Math.floor((time % 86400) / 3600);
	const minutes = Math.floor((time % 3600) / 60);

	if (days == 1) {
		return "Tomorrow";
	}

	if (days > 1) {
		return `In ${days} Days`;
	}

	if (hours > 0) {
		if (minutes > 30) {
			return `In ${hours + 1} Hours`;
		}

		return `In ${hours} ${hours > 1 ? "Hours" : "Hour"}`;
	}

	// The minutes are not exact because we round up a little bit (e.g. if something is 18 minutes away, you will probably say "In 20 Minutes" rather than "In 15 Minutes")
	if (minutes > 0) {
		if (minutes >= 50) {
			return "In 1 Hour";
		}

		if (minutes >= 40) {
			return "In 45 Minutes";
		}

		if (minutes >= 25) {
			return "In 30 Minutes";
		}

		if (minutes >= 18) {
			return "In 20 Minutes";
		}

		if (minutes >= 13) {
			return "In 15 Minutes";
		}

		if (minutes >= 8) {
			return "In 10 Minutes";
		}

		if (minutes >= 5) {
			return "In 5 Minutes";
		}

		return "Very Soon";
	}

	return "Soon";
}
