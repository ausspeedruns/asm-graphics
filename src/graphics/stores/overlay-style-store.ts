import { create } from "zustand";
import type NodeCG from "nodecg/types";

interface State {
	fontsFiles: NodeCG.AssetFile[];
	backgroundFiles: NodeCG.AssetFile[];
	fonts: {
		body: NodeCG.AssetFile | undefined;
		game: NodeCG.AssetFile | undefined;
		nameplate: NodeCG.AssetFile | undefined;
	};
	colours: {
		background: string;
		nameplate: string;
		nameplateTalking: string;
		nameplatePronouns: string;
		couch: string;
		couchTalking: string;
	};
}

interface Actions {
	setFontFile: (type: keyof State["fonts"], file: NodeCG.AssetFile | undefined) => void;
	setColour: (element: keyof State["colours"], colour: string) => void;
}

export const useOverlayStyleStore = create<State & Actions>()((set) => ({
	fontsFiles: [],
	backgroundFiles: [],
	fonts: {
		body: undefined,
		game: undefined,
		nameplate: undefined,
	},
	colours: {
		background: "#00000000",
		nameplate: "#ffffffcc",
		nameplateTalking: "#ff0000cc",
		nameplatePronouns: "#00ff00cc",
		couch: "#ffffffcc",
		couchTalking: "#ff0000cc",
	},
	setFontFile: (type, file) =>
		set((state) => ({
			fonts: {
				...state.fonts,
				[type]: file,
			},
		})),
	setColour: (element, colour) =>
		set((state) => ({
			colours: {
				...state.colours,
				[element]: colour,
			},
		})),
}));

nodecg.Replicant("assets:fonts", "asm-graphics").on("change", (newVal) => {
	useOverlayStyleStore.setState({ fontsFiles: newVal as NodeCG.AssetFile[] });
});

nodecg.Replicant("assets:backgrounds", "asm-graphics").on("change", (newVal) => {
	useOverlayStyleStore.setState({ backgroundFiles: newVal as NodeCG.AssetFile[] });
});
