import type { AudioIndicator } from "@asm-graphics/types/Audio";
import type { RunDataActiveRun, RunDataPlayer } from "@asm-graphics/types/RunData";
import type { Timer } from "@asm-graphics/types/Timer";
import type NodeCG from "nodecg/types";
import { create } from "zustand";

interface State {
	runData: RunDataActiveRun | undefined;
	timer: Timer;
	commentators: RunDataPlayer[];
	host: RunDataPlayer | undefined;
	sponsors: NodeCG.AssetFile[];
	fonts: NodeCG.AssetFile[];
	backgrounds: NodeCG.AssetFile[];
	gameAudioIndicator: string;
	microphoneAudioIndicator: AudioIndicator | undefined;
	onScreenWarning: { message: string; show: boolean };
	showHost: boolean;
}

export const useOverlayStore = create<State>()(() => ({
	runData: undefined,
	timer: {
		milliseconds: 0,
		state: "stopped",
		time: "00:00:00",
		timestamp: 0,
		teamFinishTimes: {},
	},
	commentators: [],
	host: undefined,
	sponsors: [],
	fonts: [],
	backgrounds: [],
	gameAudioIndicator: "",
	microphoneAudioIndicator: undefined,
	onScreenWarning: { message: "", show: false },
	showHost: false,
}));

nodecg.Replicant("runDataActiveRun", "nodecg-speedcontrol").on("change", (newVal) => {
	useOverlayStore.setState({ runData: newVal as RunDataActiveRun | undefined });
});

nodecg.Replicant("timer", "nodecg-speedcontrol").on("change", (newVal) => {
	useOverlayStore.setState({ timer: newVal as Timer });
});

nodecg.Replicant("commentators").on("change", (newVal) => {
	useOverlayStore.setState({ commentators: [...newVal as RunDataPlayer[]] });
});

nodecg.Replicant("host").on("change", (newVal) => {
	useOverlayStore.setState({ host: newVal as RunDataPlayer | undefined });
});

nodecg.Replicant("assets:sponsors", "asm-graphics").on("change", (newVal) => {
	useOverlayStore.setState({ sponsors: newVal as NodeCG.AssetFile[] });
});

nodecg.Replicant("assets:fonts", "asm-graphics").on("change", (newVal) => {
	useOverlayStore.setState({ fonts: newVal as NodeCG.AssetFile[] });
});

nodecg.Replicant("assets:backgrounds", "asm-graphics").on("change", (newVal) => {
	useOverlayStore.setState({ backgrounds: newVal as NodeCG.AssetFile[] });
});

nodecg.Replicant("game-audio-indicator").on("change", (newVal) => {
	useOverlayStore.setState({ gameAudioIndicator: newVal as string });
});

nodecg.Replicant("audio-indicators").on("change", (newVal) => {
	useOverlayStore.setState({ microphoneAudioIndicator: newVal as AudioIndicator | undefined });
});

nodecg.Replicant("onScreenWarning:show").on("change", (newVal) => {
	useOverlayStore.setState((state) => ({ onScreenWarning: { ...state.onScreenWarning, show: newVal as boolean } }));
});

nodecg.Replicant("onScreenWarning:message").on("change", (newVal) => {
	useOverlayStore.setState((state) => ({ onScreenWarning: { ...state.onScreenWarning, message: newVal as string } }));
});

nodecg.Replicant("showHost").on("change", (newVal) => {
	useOverlayStore.setState({ showHost: newVal as boolean });
});
