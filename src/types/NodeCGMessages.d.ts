import type { Commentator } from "./OverlayProps";
import type { Donation } from "./Donations";
import type { Incentive } from "./Incentives";
import type { Prize } from "./Prizes";
import type { BoardCell, RoomJoinParameters } from "../extensions/util/bingosync";
import type { HostRead } from "../extensions/host-reads";
import type { IntermissionVideo } from "../extensions/intermission-videos";
import type { LowerThirdPerson } from "../extensions/full-screen-data";
import type { RunDataPlayer } from "./RunData";

export type NodeCGMessages = {
	// Audio
	changeGameAudio: { manual: boolean; index: number };
	changeGameAudioName: { name: string; index: number };
	// Commentators / Host
	"update-commentator": Commentator;
	"delete-commentator": string;
	showHost: boolean;
	// Donations
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
	// Runner Tablet
	"runner:setReady": never;
	"runner:setNotReady": never;
	"tech:setReady": never;
	"tech:setNotReady": never;
	// Schedule Import
	"scheduleImport:import": never;
	"scheduleImport:getGameYears": never;
	"scheduleImport:inject-5-min-runs": never;
	// X32 Audio
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
	"speedcontrol:reorderRunners": { runId: string; newOrder: RunDataPlayer[] };
};
