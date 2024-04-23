import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { Goal, War } from "@asm-graphics/types/Incentives";
import { Commentator } from "@asm-graphics/types/OverlayProps";
import { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";

import { IntermissionElement, IntermissionRef } from "./intermission";
import NodeCG from "@nodecg/types";

const Intermission: React.FC = () => {
	const [sponsorsRep] = useReplicant<NodeCG.AssetFile[]>("assets:sponsors");
	const [incentivesRep] = useReplicant<(Goal | War)[]>("incentives");
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [hostRep] = useReplicant<Commentator | undefined>("host", undefined);
	const [donationRep] = useReplicant<number>("donationTotal");

	const intermissionRef = useRef<IntermissionRef>(null);

	useListenFor("showTweet", (newVal) => {
		if (intermissionRef.current) intermissionRef.current.showTweet(newVal);
	});

	useListenFor("playAd", (newVal) => {
		if (intermissionRef.current) intermissionRef.current.showAd(newVal);
	});

	return (
		<IntermissionElement
			ref={intermissionRef}
			activeRun={runDataActiveRep}
			runArray={runDataArrayRep ?? []}
			donation={donationRep ?? 0}
			host={hostRep}
			sponsors={sponsorsRep}
			incentives={incentivesRep}
			muted
		/>
	);
};

createRoot(document.getElementById("root")!).render(<Intermission />);
