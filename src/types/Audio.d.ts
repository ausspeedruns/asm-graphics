export interface OBSAudioIndicator {
	id: string;
	inputName: string;
	active: boolean;
}

// export type AudioIndicator = Map<string, boolean>;
export type AudioIndicator = Record<string, boolean>;
