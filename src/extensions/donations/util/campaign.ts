import { Donation, Campaign as CampaignData } from '../../../types/Tiltify';
import TiltifyClient from './tiltify-api';

class Campaign {
	_sendRequest: <TItem>(path: string, callback: (results: TItem) => void) => Promise<void>;
	_doRequest: (path: string) => Promise<any>;
	apiKey: string;
	_sendArrayRequest: <TItem>(path: string, callback: (results: TItem[]) => void) => Promise<void>;

	/**
	 * A new campaign api object.
	 * @param {object} self is `this` from index.js
	 * @constructor
	 */
	constructor(self: TiltifyClient) {
		this._sendRequest = self._sendRequest
		this._sendArrayRequest = self._sendArrayRequest
		this._doRequest = self._doRequest
		this.apiKey = self.apiKey
	}

	/**
	 * returns information about a campaign.
	 * The total raised is in this returned object.
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	get(id: string, callback: (campaign: CampaignData) => any) {
		this._sendRequest(`campaigns/${id}`, callback)
	}

	/**
	 * returns the most recent page of donations.
	 * Use this if polling for new donations.
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getRecentDonations(id: string, callback: (arg0: any) => void) {
		this._doRequest(`campaigns/${id}/donations`).then(function (response: string) {
			const body = JSON.parse(response)
			callback(body.data)
		})
	}

	/**
	 * returns ALL donations from a campaign.
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getDonations(id: string, callback: (donations: Donation[]) => void) {
		this._sendArrayRequest(`campaigns/${id}/donations?count=500`, callback)
	}

	/**
	 * returns all rewards for a campaign
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getRewards(id: string, callback: any) {
		this._sendRequest(`campaigns/${id}/rewards`, callback)
	}

	/**
	 * returns all polls for a campaign
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getPolls(id: string, callback: any) {
		this._sendRequest(`campaigns/${id}/polls`, callback)
	}

	/**
	 * returns all challenges for a campaign
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getChallenges(id: string, callback: any) {
		this._sendRequest(`campaigns/${id}/challenges`, callback)
	}
	/**
	 * returns the schedule of a campaign
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getSchedule(id: string, callback: any) {
		this._sendRequest(`campaigns/${id}/schedule`, callback)
	}

	/**
	 * returns all supporting campaigns for a campaign
	 * @param {string} id The campaign ID that you're looking up
	 * @param {requestCallback} callback A function to call when we're done getting data
	 */
	getSupportingCampaigns(id: string, callback: any) {
		this._sendRequest(`campaigns/${id}/supporting-campaigns`, callback)
	}
}

export default Campaign
