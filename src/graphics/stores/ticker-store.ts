import { create } from "zustand";
import type { RunDataArray, RunDataActiveRun } from "@asm-graphics/types/RunData";
import type { Incentive } from "@asm-graphics/types/Incentives";
import type { DonationMatch } from "@asm-graphics/types/Donations";
import type { Prize } from "@asm-graphics/types/Prizes";
import type { TickerSegment } from "@asm-graphics/types/Ticker";

type TickerOrderItem = { id: TickerSegment; enabled: boolean; settings?: Record<string, unknown> };

interface TickerState {
	runDataArray: RunDataArray;
	runDataActive: RunDataActiveRun | undefined;
	incentives: Incentive[];
	donationTotal: number;
	manualDonationTotal: number;
	donationMatches: DonationMatch[];
	prizes: Prize[];
	tickerOrderRaw: TickerOrderItem[];
}

export const useTickerStore = create<TickerState>(() => ({
	runDataArray: [],
	runDataActive: undefined,
	incentives: [],
	donationTotal: 0,
	manualDonationTotal: 0,
	donationMatches: [],
	prizes: [],
	tickerOrderRaw: [],
}));

function cloneArray<T>(value: T[] | undefined): T[] {
	return Array.isArray(value) ? [...value] : [];
}

nodecg.Replicant("runDataArray", "nodecg-speedcontrol").on("change", (v) => {
	useTickerStore.setState({ runDataArray: cloneArray(v as RunDataArray | undefined) });
});

nodecg.Replicant("runDataActiveRun", "nodecg-speedcontrol").on("change", (v) => {
	useTickerStore.setState({ runDataActive: v as RunDataActiveRun | undefined });
});

nodecg.Replicant("incentives").on("change", (v) => {
	useTickerStore.setState({ incentives: cloneArray(v as Incentive[] | undefined) });
});

nodecg.Replicant("donationTotal").on("change", (v) => {
	useTickerStore.setState({ donationTotal: Number(v ?? 0) });
});

nodecg.Replicant("manual-donation-total").on("change", (v) => {
	useTickerStore.setState({ manualDonationTotal: Number(v ?? 0) });
});

nodecg.Replicant("donation-matches").on("change", (v) => {
	useTickerStore.setState({ donationMatches: cloneArray(v as DonationMatch[] | undefined) });
});

nodecg.Replicant("prizes").on("change", (v) => {
	useTickerStore.setState({ prizes: cloneArray(v as Prize[] | undefined) });
});

nodecg.Replicant("ticker:order").on("change", (v) => {
	useTickerStore.setState({ tickerOrderRaw: cloneArray(v as TickerOrderItem[] | undefined) });
});
