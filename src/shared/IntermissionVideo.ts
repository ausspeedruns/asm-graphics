export interface VideoInformation {
	duration: number; // in seconds
	verticalResolution: number;
	horizontalResolution: number;
	aspectRatio: string; // e.g. "16:9"
}

export interface IntermissionVideo {
	asset: string; // Serves as PK
	volume: number;
	displayName: string;
	videoInfo?: VideoInformation;
	enabled: boolean;
	loading: boolean; // Not saved in replicant
}
