import type { Commentator } from "./OverlayProps";
import type { Donation } from "./Donations";
import type { Stream } from "./Streams";
import type { StaffMessage } from "./StaffMessages";
import type { Tweet } from "./Twitter";

export type NodeCGMessages = {
	// Host
	"update-hostname": Commentator;
	"update-hostnames": Commentator[];
	"rename-couch": Commentator;
	"remove-hostname": string;
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
	// OBS Local
	"transition:toIntermission": { to: string; from: string };
	"transition:toGame": { to: string; from: string };
	"transition:toIRL": { to: string, from: string };
	"transition:UNKNOWN": { to: string, from: string }
	"runTransitionGraphic": never;
	// OBS Online
	"connectOBS": never;
	"disconnectOBS": never;
	"changeOverlayPreview": string;
	"changeOverlayLive": string;
	"newTwitchStream": Stream;
	"removeTwitchStream": string;
	// Runner Tablet
	"runner:setReady": never;
	"runner:setNotReady": never;
	"tech:setReady": never;
	"tech:setNotReady": never;
	// Schedule Import
	"scheduleImport:import": never;
	// Staff messages
	"staff-sendMessage": StaffMessage;
	// X32 Audio
	"x32:setFader": { mixBus: number; float: number; channel: number };
	"x32:changeGameAudio": string;
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
	// Misc
	"start-credits": never;
}
