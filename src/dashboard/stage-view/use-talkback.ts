import { useState } from "react";
import type { Commentator } from "@asm-graphics/types/OverlayProps";
import type { RunDataPlayer } from "../../../bundles/nodecg-speedcontrol/src/types";

export function useTalkback(commentators?: Commentator[], runners?: RunDataPlayer[]) {
	const [currentTalkbackTargets, setCurrentTalkbackTargets] = useState<string[]>([]);

	const allCommentatorIds = commentators?.filter((c) => c.id !== "host").map((c) => c.id) ?? [];
	const allRunnerIds = runners?.map((p) => p.id) ?? [];
	const host = commentators?.find((c) => c.id === "host");
	const allIds = [...allCommentatorIds, ...allRunnerIds, ...(host ? [host.id] : [])];

	const isTalkingToAllRunners =
		allRunnerIds.length > 0 && allRunnerIds.every((id) => currentTalkbackTargets.includes(id));
	const isTalkingToAllCommentators =
		allCommentatorIds.length > 0 &&
		commentators?.filter((c) => c.id !== "host").every((c) => currentTalkbackTargets.includes(c.id));

	function toggleTalkbackRunners() {
		if (isTalkingToAllRunners) {
			setCurrentTalkbackTargets([]);
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			setCurrentTalkbackTargets(allRunnerIds);
			nodecg.sendMessage("x32:talkback-start", allRunnerIds);
		}
	}

	function toggleTalkbackCommentators() {
		if (isTalkingToAllCommentators) {
			setCurrentTalkbackTargets([]);
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			const commentatorIds = commentators?.filter((c) => c.id !== "host")?.map((c) => c.id) ?? []; // Excluding host
			setCurrentTalkbackTargets(commentatorIds);
			nodecg.sendMessage("x32:talkback-start", commentatorIds);
		}
	}

	function toggleTalkToAll() {
		if (currentTalkbackTargets.length > 0) {
			setCurrentTalkbackTargets([]);
			nodecg.sendMessage("x32:talkback-stop");
		} else {
			setCurrentTalkbackTargets(allIds);
			nodecg.sendMessage("x32:talkback-start", allIds);
		}
	}

	function forceStopTalkback() {
		setCurrentTalkbackTargets([]);
		nodecg.sendMessage("x32:talkback-stop");
	}

	return {
		currentTalkbackTargets,
		setCurrentTalkbackTargets,
		isTalkingToAllCommentators,
		isTalkingToAllRunners,
		allCommentatorIds,
		allRunnerIds,
		host,
		allIds,
		toggleTalkbackCommentators,
		toggleTalkbackRunners,
		toggleTalkToAll,
		forceStopTalkback,
	};
}
