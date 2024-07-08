import type { Commentator } from "./OverlayProps";
import type { Donation } from "./Donations";
import type { Stream } from "./Streams";
import type { StaffMessage } from "./StaffMessages";
import type { Tweet } from "./Twitter";

export type NodeCGMessages = {
	// Audio
	"changeGameAudio": { manual: boolean, index: number }
	"changeGameAudioName": { name: string, index: number }
	// Commentators / Host
	"update-hostname": Commentator;
	"update-hostnames": Commentator[];
	"rename-couch": Commentator;
	"remove-hostname": string;
	"remove-preview-hostname": number;
	"update-commentator": Commentator;
	"delete-commentator": string;
	"update-host": Commentator;
	// Donations
	"donations:toggleRead": string;
	"manual-donations:toggleRead": string;
	"manual-donations:new": Donation;
	"manual-donations:remove": string;
	"markDonationReadUnread": string;
	// Incentives
	"disableIncentive": number;
	"activateIncentive": number;
	"updateIncentives": never;
	"incentivesUpdated": number;
	// OBS Audio
	"update-audioindicator": string;
	"update-obs-gate": number;
	"update-obs-audio": { id: string; inputName: string };
	"remove-obs-audio": string;
	"muteSourceAudio": { source: string, mute: boolean };
	"changeSourceAudio": { source: string; volume: number }
	// OBS Local
	"transition:toIntermission": { to: string; from: string };
	"transition:toGame": { to: string; from: string };
	"transition:toIRL": { to: string, from: string };
	"transition:UNKNOWN": { to: string, from: string }
	// OBS Online
	"connectOBS": never;
	"disconnectOBS": never;
	"changeOverlayPreview": string;
	"changeOverlayLive": string;
	"newTwitchStream": Stream;
	"removeTwitchStream": string;
	"goToIntermission": never;
	"transitionGameplay": never;
	// Runner Tablet
	"runner:setReady": never;
	"runner:setNotReady": never;
	"tech:setReady": never;
	"tech:setNotReady": never;
	// Schedule Import
	"scheduleImport:import": never;
	"scheduleImport:getGameYears": never;
	"scheduleImport:inject-5-min-runs": never;
	// Staff messages
	"staff-sendMessage": StaffMessage;
	// X32 Audio
	"x32:setFader": { mixBus: number; float: number; channel: number };
	"x32:changeGameAudio": number;
	"x32:mute-host": never;
	"x32:unmute-host": never;
	"x32:host-mute-couch": never;
	"x32:host-unmute-couch": never;
	// Twitter
	"newTweet": Tweet;
	"discardTweet": string;
	"undoTweetDeletion": never;
	"showTweet": Tweet;
	"playAd": string;
	"showPotentialTweet": Tweet | undefined;
	"refresh-tweets": never;
	// ASNN
	"asnn:showName": { name: string; subtitle: string };
	"asnn:hideName": never;
	// Misc
	"start-credits": never;
	"show-lowerthird": never;
	"hide-lowerthird": never;
	"show-acknowledgementofcountry": never;
	"hide-acknowledgementofcountry": never;
	// Rando
	"rando:unlock": { game: string, item: string },
	"rando:lock": { game: string, item: string },
}
