import { create } from "zustand";

import type NodeCG from "nodecg/types";
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo";
import type { Incentive } from "@asm-graphics/types/Incentives";
import type { Prize } from "@asm-graphics/types/Prizes";
import type { RunDataActiveRun, RunDataArray, RunDataPlayer } from "@asm-graphics/types/RunData";
import type { DonationMatch } from "@asm-graphics/types/Donations";

interface State {
	activeRun: RunDataActiveRun;
	runArray: RunDataArray;
	host?: RunDataPlayer;
	donationTotal: number;
	manualDonationTotal: number;
	apiDonationTotal: number;
	sponsors: NodeCG.AssetFile[];
	incentives: Incentive[];
	photos: NodeCG.AssetFile[];
	donationMatches: DonationMatch[];
	donationMatchMultiplier: number;
	prizes: Prize[];
	videos: IntermissionVideo[];
}

export const useIntermissionStore = create<State>()(() => ({
	activeRun: undefined,
	runArray: [],
	host: undefined,
	donationTotal: 0,
	manualDonationTotal: 0,
	apiDonationTotal: 0,
	sponsors: [],
	incentives: [],
	photos: [],
	donationMatches: [],
	donationMatchMultiplier: 1,
	prizes: [],
	videos: [],
}));

nodecg.Replicant("runDataActiveRun", "nodecg-speedcontrol").on("change", (newVal) => {
	useIntermissionStore.setState({ activeRun: newVal as RunDataActiveRun | undefined });
});

nodecg.Replicant("runDataArray", "nodecg-speedcontrol").on("change", (newVal) => {
	useIntermissionStore.setState({ runArray: newVal as RunDataArray });
});

nodecg.Replicant("donationTotal").on("change", (newVal) => {
	useIntermissionStore.setState((state) => ({ ...state, apiDonationTotal: newVal as number, donationTotal: newVal as number + state.manualDonationTotal }));
});

nodecg.Replicant("assets:sponsors", "asm-graphics").on("change", (newVal) => {
	useIntermissionStore.setState({ sponsors: newVal as NodeCG.AssetFile[] });
});

nodecg.Replicant("incentives").on("change", (newVal) => {
	useIntermissionStore.setState({ incentives: newVal as Incentive[] });
});
nodecg.Replicant("manual-donation-total").on("change", (newVal) => {
	useIntermissionStore.setState((state) => ({ ...state, manualDonationTotal: newVal as number, donationTotal: state.apiDonationTotal + (newVal as number) }));
});
nodecg.Replicant("assets:eventPhotos", "asm-graphics").on("change", (newVal) => {
	useIntermissionStore.setState({ photos: newVal as NodeCG.AssetFile[] });
});

nodecg.Replicant("donation-matches").on("change", (newVal) => {
	useIntermissionStore.setState({ donationMatches: newVal as DonationMatch[], donationMatchMultiplier: ((newVal as DonationMatch[]).filter((match) => match.active).length ?? 0) + 1 });
});

nodecg.Replicant("prizes").on("change", (newVal) => {
	useIntermissionStore.setState({ prizes: newVal as Prize[] });
});

nodecg.Replicant("intermission-videos").on("change", (newVal) => {
	useIntermissionStore.setState({ videos: newVal as IntermissionVideo[] });
});

nodecg.Replicant("commentators").on("change", (newVal) => {
	useIntermissionStore.setState({ host: (newVal as RunDataPlayer[]).find((player) => player.customData["tag"] === "Host") });
});

