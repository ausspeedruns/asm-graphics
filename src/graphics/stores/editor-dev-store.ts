import { create } from "zustand";

interface EditorDevState {
	devMode: boolean;
	setDevMode: (enabled: boolean) => void;
	toggleDevMode: () => void;
}

export const useEditorDevStore = create<EditorDevState>()((set) => ({
	devMode: false,
	setDevMode: (enabled) => set({ devMode: enabled }),
	toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),
}));