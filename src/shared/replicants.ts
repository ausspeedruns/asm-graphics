import * as nodecgApiContext from "../extensions/nodecg-api-context.js";

import type NodeCG from "nodecg/types";
import type { RunDataPlayer } from "./types/RunData.js";
import type { Donation, DonationMatch } from "./types/Donations.js";
import type { Incentive } from "./types/Incentives.js";
import type { AudioIndicator, OBSAudioIndicator } from "./types/Audio.js";
import type { User as AusSpeedrunsUser } from "./types/AusSpeedrunsWebsite.js";
import type { Automations } from "./types/Automations.js";
import type { Prize } from "./types/Prizes.js";
import type { BoardState, RoomJoinParameters } from "./BingoSync.js";
import type { HostRead } from "./HostRead.js";
import type { IntermissionVideo } from "./IntermissionVideo.js";
import type { LowerThirdPerson } from "./FullscreenGraphic.js";

type Primitives = string | number | boolean | null;

type ReplicantValueType = Primitives | Primitives[] | object[] | NodeCG.Replicant.Options<any>;

const nodecg = nodecgApiContext.get();

export interface ConnectionStatus {
	status: "disconnected" | "connected" | "warning" | "error" | "connecting";
	timestamp: number;
	message: string;
}

const defaultStatus: ConnectionStatus = {
	status: "disconnected",
	timestamp: 0,
	message: "",
};

export const replicants = {
	// Commentators/Host
	commentators: [] as RunDataPlayer[],
	"headsets-used": { defaultValue: {} as Record<string, number> },
	showHost: true as boolean,

	// Donations
	"tiltify:status": { defaultValue: { ...defaultStatus }, persistent: false },
	"tiltify:connectionDetails": {
		defaultValue: {
			clientSecret: nodecg.bundleConfig.tiltify?.key ?? "", // Todo: Rename to clientSecret in config
			campaignId: nodecg.bundleConfig.tiltify?.campaign ?? "",
			clientId: nodecg.bundleConfig.tiltify?.id ?? "", // Todo: Rename to clientId in config
		},
	},
	"tiltify:donation-update-interval": 10000, // TODO: Make configurable via dashboard
	donationTotal: 0,
	donations: [] as Donation[],
	"manual-donations": [] as Donation[],
	"manual-donation-total": 0,
	"donation-matches": [] as DonationMatch[],

	// Audio Shared
	"game-audio-indicator": -1,
	"x32:audio-gate": -10,
	"game-audio-names": [] as string[],

	// OBS Audio
	"obs-audio-indicator": { defaultValue: [] as OBSAudioIndicator[], persistent: false },
	"obs:audio-gate": -10,

	// X32 Audio
	"x32:connectionDetails": {
		defaultValue: {
			ip: nodecg.bundleConfig.x32?.ip ?? "",
		},
	},
	"x32:status": { defaultValue: { ...defaultStatus }, persistent: false },
	"audio-indicators": { defaultValue: {} as AudioIndicator },
	"x32:busFaders": { defaultValue: [] as number[][], persistent: false },

	// Incentives
	incentives: [] as Incentive[],

	// GraphQL
	"ausspeedruns-website:settings": {
		defaultValue: {
			eventSlug: nodecg.bundleConfig.graphql?.event ?? "",
			apiKey: nodecg.bundleConfig.graphql?.apiKey ?? "",
			url: nodecg.bundleConfig.graphql?.url ?? "",
			incentiveRefreshInterval: 10000,
		},
	},
	"incentives:updated-at": null as number | null,
	"incentives:update-interval": 10000, // TODO: Make configurable via dashboard
	"all-usernames": [] as AusSpeedrunsUser[],

	// OBS
	"obs:connectionDetails": {
		defaultValue: {
			address: `${nodecg.bundleConfig.obs?.ip}:${nodecg.bundleConfig.obs?.port}`,
			password: nodecg.bundleConfig.obs?.password ?? "",
		},
	},
	"obs:status": { defaultValue: { ...defaultStatus }, persistent: false },
	"obs:currentScene": "Intermission",
	"obs:previewScene": null as string | null,
	"obs:streamTimecode": { defaultValue: null as string | null },
	"obs:localRecordings": false as boolean,
	"obs:autoReconnect": true as boolean,
	"obs:reconnectInterval": 5000,
	"obs:gameplayCaptureScenes": [] as string[],

	// Full Screen Info
	lowerThirdPerson: { defaultValue: { name: "", title: "" } as LowerThirdPerson },
	acknowledgementOfCountry: "",

	// Runner Tablet
	"runner:ready": false as boolean,
	"tech:ready": false as boolean,

	// ASNN
	"asnn:headline": "",
	"asnn:ticker": [] as string[],

	// Automation Settings
	automations: {
		defaultValue: {
			runAdvance: true,
			runTransition: true,
			audioMixing: true,
			clearCommentators: true,
		} as Automations,
	},

	// On Screen Warnings
	"onScreenWarning:show": false as boolean,
	"onScreenWarning:message": "",

	// Prizes
	prizes: [] as Prize[],

	// Bingosync
	"bingosync:roomDetails": {
		defaultValue: {
			room: "",
			nickname: "",
			password: "",
		} as RoomJoinParameters,
	},
	"bingosync:boardState": { defaultValue: { cells: [] } as BoardState },
	"bingosync:status": { defaultValue: { ...defaultStatus }, persistent: false },
	"bingosync:boardStateOverride": { defaultValue: { cells: [] } as BoardState },

	// Host Reads
	"host-reads": [] as HostRead[],

	// Intermission Videos
	"intermission-videos": [] as IntermissionVideo[],

	// Speedcontrol Metadata
	runStartTime: null as number | null,

	// ASM-Graphics settings / Misc
} satisfies Record<string, ReplicantValueType>;

type ReplicantValue<T> = T extends { defaultValue: infer D } ? D : T;

export type ReplicantName = keyof typeof replicants;

export type ReplicantType<N extends ReplicantName> = ReplicantValue<(typeof replicants)[N]>;
