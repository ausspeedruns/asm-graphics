import { Button, Stack, ThemeProvider } from "@mui/material";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { darkTheme } from "./theme";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import { useReplicant } from "@nodecg/react-hooks";
import type { X32TalkbackTarget } from "../extensions/x32-audio";
import { useState } from "react";

const DashboardTalkbackContainer = styled.div``;

const EmptyTalkbackIndicator = styled.div`
	width: 100%;
	height: 20px;
	background-color: #3e4f64ff;
	border-radius: 4px;
	margin: 8px 0;
`;

const TalkbackActiveIndicator = styled.div`
	width: 100%;
	height: 20px;
	background-color: yellow;
	border-radius: 4px;
	margin: 8px 0;

	@keyframes flash {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
		100% {
			opacity: 1;
		}
	}

	animation: flash 250ms step-start infinite;
`;

const targets = [
	{ id: "all", name: "All" },
	{ id: "runnersCouch", name: "Runners + Couch" },
	{ id: "host", name: "Host" },
	{ id: "runners", name: "Runners" },
	{ id: "couch", name: "Couch" },
];

export function DashboardTalkback() {
	const [currentTarget, setCurrentTarget] = useState<X32TalkbackTarget | null>(null);

	const [hostRep] = useReplicant<Commentator>("host");
	const [commentatorsRep] = useReplicant<Commentator[]>("commentators");

	function handleToggleTalk(target: X32TalkbackTarget) {
		console.log("Starting talkback to", target);
		if (currentTarget === target) {
			setCurrentTarget(null);
			console.log("Stopping talkback");
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			setCurrentTarget(target);
			nodecg.sendMessage("x32:talkback-start", target);
		}
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<DashboardTalkbackContainer>
				Hold button to talk. Avoid as much as possible during a run.
				{currentTarget ? <TalkbackActiveIndicator /> : <EmptyTalkbackIndicator />}
				<Stack spacing={1} mb={1}>
					{targets.map((target) => (
						<Button
							key={target.id}
							fullWidth
							variant={currentTarget === target.id ? "contained" : "outlined"}
							disabled={Boolean(currentTarget && currentTarget !== target.id)}
							color="primary"
							onClick={() => handleToggleTalk(target.id)}>
							Talk to {target.id === "host" ? `Host (${hostRep?.name})` : target.name}
						</Button>
					))}
					<hr />
					{(commentatorsRep ?? []).map((commentator) => (
						<Button
							key={commentator.id}
							fullWidth
							variant={currentTarget === commentator.id ? "contained" : "outlined"}
							color="primary"
							disabled={Boolean(currentTarget && currentTarget !== commentator.id)}
							onClick={() => handleToggleTalk(commentator.id)}>
							{commentator.name}
						</Button>
					))}
				</Stack>
			</DashboardTalkbackContainer>
		</ThemeProvider>
	);
}

createRoot(document.getElementById("root")!).render(<DashboardTalkback />);
