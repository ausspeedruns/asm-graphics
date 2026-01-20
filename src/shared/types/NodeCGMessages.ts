import type { Donation } from "./Donations.js";
import type { Incentive } from "./Incentives.js";
import type { Prize } from "./Prizes.js";
import type { BoardCell, RoomJoinParameters } from "@asm-graphics/shared/BingoSync.js";
import type { HostRead } from "@asm-graphics/shared/HostRead.js";
import type { IntermissionVideo } from "@asm-graphics/shared/IntermissionVideo.js";
import type { LowerThirdPerson } from "@asm-graphics/shared/FullscreenGraphic.js";
import type { RunDataPlayer } from "./RunData.js";
import type { CropSettings } from "../obs-types.js";

export type NodeCGMessages = {
	// Audio
	changeGameAudio: { manual: boolean; id: string };
	// Commentators / Host
	"update-commentator": {
		id?: string;
		name: string;
		pronouns?: string;
		twitch?: string;
		tag?: string;
		microphone?: string;
	};
	"delete-commentator": string;
	showHost: boolean;
	"commentators:reorder": string[];
	"commentators:runnerToCommentator": { runnerId: string; positionIndex: number };
	// Donations
	"tiltify:setConnection": boolean;
	"donations:toggleRead": string;
	"manual-donations:toggleRead": string;
	"manual-donations:new": Donation;
	"manual-donations:remove": string;
	// Incentives
	refreshIncentives: never;
	incentivesUpdated: number;
	updateIncentive: Incentive;
	// OBS Audio
	"update-audioindicator": string;
	"update-obs-gate": number;
	"update-obs-audio": { id: string; inputName: string };
	"remove-obs-audio": string;
	muteSourceAudio: { source: string; mute: boolean };
	changeSourceAudio: { source: string; volume: number };
	// OBS Local
	"transition:toIntermission": { to: string; from: string };
	"transition:toGame": { to: string; from: string };
	"transition:toIRL": { to: string; from: string };
	"transition:UNKNOWN": { to: string; from: string };
	"obs:setRecording": boolean;
	"obs:setConnected": boolean;
	// Runner Tablet
	"runner:setReady": never;
	"runner:setNotReady": never;
	"tech:setReady": never;
	"tech:setNotReady": never;
	// Schedule Import
	"scheduleImport:import": never;
	"scheduleImport:getGameYears": never;
	// X32 Audio
	"x32:setConnected": boolean;
	"x32:setFader": { mixBus: number; float: number; channel: number };
	"x32:changeGameAudio": number;
	"x32:mute-host": never;
	"x32:unmute-host": never;
	"x32:host-mute-couch": never;
	"x32:host-unmute-couch": never;
	"x32:talkback-start": string[];
	"x32:talkback-stop": never;
	// ASNN
	"asnn:showName": { name: string; subtitle: string };
	"asnn:hideName": never;
	// Misc
	"start-credits": never;
	"lowerthird:save-person": LowerThirdPerson;
	"lowerthird:show": never;
	"lowerthird:hide": never;
	"show-acknowledgementofcountry": never;
	"hide-acknowledgementofcountry": never;
	// Rando
	"rando:unlock": { game: string; item: string };
	"rando:lock": { game: string; item: string };
	// On Screen Warnings
	"onScreenWarning:setMessage": string;
	"onScreenWarning:setShow": boolean;
	// Prizes
	"prizes:ReorderPrizes": Prize[];
	"prizes:NewPrize": Prize;
	"prizes:RemovePrize": string;
	"prizes:UpdatePrize": Prize;
	// Bingosync
	"bingosync:joinRoom": RoomJoinParameters;
	"bingosync:leaveRoom": never;
	"bingosync:overrideCell": { cellSlot: string; cellData?: BoardCell };
	// Countdown
	"countdown:start": `${number}:${number}:${number}`;
	"countdown:stop": never;
	// Host Reads
	"host-reads:add": HostRead;
	"host-reads:remove": string;
	"host-reads:update": HostRead;
	// Intermission Videos
	"intermission-videos:play": string;
	"intermission-videos:update": IntermissionVideo;
	"intermission-videos:refreshInfo": string;
	// Speedcontrol Converter
	"speedcontrol:editRunner": { runId: string; runner: RunDataPlayer };
	"speedcontrol:reorderRunners": { runId: string; newOrder: string[] };
	"speedcontrol:commentatorToRunner": { commentatorId: string; teamIndex: number; positionIndex: number };
	// AusSpeedruns Website
	"ausspeedruns-website:recollectUserData": never;
	// OBS Game Crop
	"obs:getSourceScreenshot": { sourceName: string }; // Returns (imageData: string)
	"obs:setCropSettings": {
		sourceName: string;
		cropSettings: CropSettings;
		sectionIndex: number;
		isPreview: boolean;
	};
	"obs:getCurrentScenes": never; // Returns (previewScene: string | null; programScene: string)
};
