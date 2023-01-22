import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import Campaign from './campaign';
import Cause from './cause';
import FundraisingEvents from './fundraisingEvents';
import Team from './team';
import User from './user';

export type TiltifyClientType = typeof TiltifyClient;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export class TiltifyClient {
	apiKey: string;
	Campaigns: Campaign;
	Causes: Cause;
	FundraisingEvents: FundraisingEvents;
	Team: Team;
	User: User;

	/**
	 * A TiltifyClient contains all of the sub-types that exist on the Tiltify API
	 * @param {string} apiKey The access token that you got from Tiltify.
	 * @constructor
	 */
	constructor(apiKey: string) {
		this.apiKey = apiKey
		/**
		 * this.Campaigns is used to get info about campaigns
		 * @type Campaign
		 */
		this.Campaigns = new Campaign(this)

		/**
		 * this.Causes is used to get info about causes
		 * @type Cause
		 */
		this.Causes = new Cause(this)

		/**
		 * this.FundraisingEvents is used to get info about fundraising events
		 * @type FundraisingEvents
		 */
		this.FundraisingEvents = new FundraisingEvents(this)

		/**
		 * this.Team is used to get info about a team
		 * @type Team
		 */
		this.Team = new Team(this)

		/**
		 * this.User is used to get info about a user
		 * @type User
		 */
		this.User = new User(this)
	}

	/**
	 * _doRequest does a single request and returns the response.
	 * Normally this is wrapped in _sendRequest, but for some
	 * endpoints like Campaigns.getRecentDonations(id) need to send
	 * only a single request. This function is not actually called in
	 * the TiltifyClient, and is passed down to each of the types.
	 * @param {string} path The path, without /api/v3/.
	 */
	async _doRequest(path: string): Promise<Record<string, any>> {
		const url = `https://tiltify.com/api/v3/${path}`
		const options: AxiosRequestConfig = {
			url: url,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
			responseType: 'json',
			httpsAgent: httpsAgent
		}
		try {
			// console.log(await axios(options))
			return await axios(options);
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * _sendRequest is used for all endpoints, but only has a recursive
	 * effect when called againt an endpoint that contains a `links.prev` string
	 * @param {string} path The path, without /api/v3/.
	 * @param {Function} callback A function to call when we're done processing.
	 */
	async _sendRequest<TItem>(path: string, callback: (results: TItem) => void) {
		const response = await this._doRequest(path)

		if (response.data.links && response.data.links.prev) {
			throw '[Tiltify API] Called _sendRequest but got an array back instead. Did you mean _sendArrayRequest?';
		} else {
			callback(response.data.data)
		}
	}

	async _sendArrayRequest<TItem>(path: string, callback: (results: TItem[]) => void) {
		const results = []
		let keepGoing = true
		while (keepGoing) {
			const response = await this._doRequest(path);

			if (response.data.links && response.data.links.prev) {
				path = response.data.links.prev.replace('/api/v3/', '').replace('count=100', 'count=500')
			}

			results.push(response.data.data)

			if (response.data.data.length === 0) {
				keepGoing = false
				const concatResults: any[] = [];
				results.forEach(block => {
					block.forEach((element: any) => {
						concatResults.push(element)
					})
				})
				callback(concatResults)
			}
		}
	}
}


export default TiltifyClient
