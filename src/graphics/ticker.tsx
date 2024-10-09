import React from "react";
import { createRoot } from "react-dom/client";
import { useReplicant } from "@nodecg/react-hooks";

import { TickerMemo } from "./elements/ticker";

import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Incentive } from "@asm-graphics/types/Incentives";
import type { DonationMatch } from "@asm-graphics/types/Donations";

export const TickerOverlay: React.FC = () => {
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [incentivesRep] = useReplicant<Incentive[]>("incentives");
	const [donationRep] = useReplicant<number>("donationTotal");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
	const [asmmRep] = useReplicant<number>("asmm:totalKM");
	const [donationMatchesRep] = useReplicant<DonationMatch[]>("donation-matches");

	return (
		<TickerMemo
			donationAmount={(donationRep ?? 0) + (manualDonationRep ?? 0)}
			runDataActive={runDataActiveRep}
			runDataArray={runDataArrayRep ?? []}
			incentives={incentivesRep ?? []}
			asmm={asmmRep}
			donationMatches={donationMatchesRep ?? []}
			tickerOrder={[
				"cta",
				"nextruns",
				"goals",
				"wars",
				// "asmm",
				// "prizes",
				"milestone",
				"donationMatches",
			]}
		/>
	);
};

createRoot(document.getElementById("root")!).render(<TickerOverlay />);
