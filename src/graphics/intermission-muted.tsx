import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { Incentive } from "@asm-graphics/types/Incentives";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";

import { IntermissionElement, IntermissionRef } from "./intermission";
import type NodeCG from "nodecg/types";
import type { IntermissionVideo } from "extensions/intermission-videos";

function Intermission() {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const [incentivesRep] = useReplicant<Incentive[]>("incentives");
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [donationRep] = useReplicant<number>("donationTotal");
	const [commentatorsRep] = useReplicant<Commentator[]>("commentators");
	const [videosRep] = useReplicant<IntermissionVideo[]>("intermission-videos");

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor("intermission-videos:play", (newVal) => {
		if (!intermissionRef.current) return;

		const foundVideo = videosRep?.find((video) => video.asset === newVal);
		if (foundVideo) {
			intermissionRef.current.showVideo(foundVideo);
		}
	});

	const host = (commentatorsRep ?? []).find((comm) => comm.id === "host");

	return (
		<IntermissionElement
			ref={intermissionRef}
			activeRun={runDataActiveRep}
			runArray={runDataArrayRep ?? []}
			donation={donationRep ?? 0}
			host={host}
			sponsors={sponsorsRep}
			incentives={incentivesRep}
			muted
		/>
	);
}

createRoot(document.getElementById("root")!).render(<Intermission />);
