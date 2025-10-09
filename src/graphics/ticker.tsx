import { createRoot } from "react-dom/client";
import { useReplicant } from "@nodecg/react-hooks";

import { TickerMemo } from "./elements/ticker";

import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Incentive } from "@asm-graphics/types/Incentives";
import type { DonationMatch } from "@asm-graphics/types/Donations";
import { Prize } from "@asm-graphics/types/Prizes";

export const TickerOverlay: React.FC = () => {
	const [runDataArrayRep] = useReplicant<RunDataArray>("runDataArray", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });
	const [incentivesRep] = useReplicant<Incentive[]>("incentives");
	const [donationRep] = useReplicant<number>("donationTotal");
	const [manualDonationRep] = useReplicant<number>("manual-donation-total");
	const [donationMatchesRep] = useReplicant<DonationMatch[]>("donation-matches");
	const [prizesRep] = useReplicant<Prize[]>("prizes");

	// const donationRep = 10000;

	// const testDonationMatches: DonationMatch[] = [
	// 	{
	// 		id: "1",
	// 		name: "Test Match 1",
	// 		amount: 500,
	// 		pledge: 500 * 2,
	// 		endsAt: Date.now() + 1000 * 60 * 60 * 2,
	// 		completedAt: 0,
	// 		active: true,
	// 		updated: Date.now(),
	// 		read: false,
	// 		time: Date.now(),
	// 		currencySymbol: "$",
	// 	},
	// 	{
	// 		id: "2",
	// 		name: "Test Match 2",
	// 		amount: 1000,
	// 		pledge: 1000 * 2,
	// 		endsAt: Date.now() + 1000 * 60 * 60 * 2,
	// 		completedAt: 0,
	// 		active: true,
	// 		updated: Date.now(),
	// 		read: false,
	// 		time: Date.now(),
	// 		currencySymbol: "$",
	// 	},
	// ];

	return (
		<TickerMemo
			donationAmount={(donationRep ?? 0) + (manualDonationRep ?? 0)}
			runDataActive={runDataActiveRep}
			runDataArray={runDataArrayRep ?? []}
			incentives={incentivesRep ?? []}
			donationMatches={donationMatchesRep ?? []}
			// donationMatches={testDonationMatches}
			prizes={prizesRep ?? []}
			tickerOrder={["cta", "nextruns", "incentives", "milestone", "donationMatches"]}
			// tickerOrder={["donationMatches"]}
		/>
	);
};

createRoot(document.getElementById("root")!).render(<TickerOverlay />);
