import TiltifyClient from './tiltify-api';

class FundraisingEvents {
  _sendRequest: (path: string, callback: (results: any) => void) => Promise<void>;
  _doRequest: (path: string) => Promise<any>;
  apiKey: string;

  /**
   * A new fundraising events api object.
   * @param {object} self is `this` from index.js
   * @constructor
   */
  constructor(self: TiltifyClient) {
    this._sendRequest = self._sendRequest
    this._doRequest = self._doRequest
    this.apiKey = self.apiKey
  }
  /**
   * returns a list of fundraising events
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  list(callback: (results: any) => void) {
    this._sendRequest(`fundraising-events`, callback)
  }
  /**
   * returns info about a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  get(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}`, callback)
  }
  /**
   * returns campaigns for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getCampaigns(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/campaigns`, callback)
  }
  /**
   * returns donations for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getDonations(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/donationss`, callback)
  }
  /**
   * returns incentives for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getIncentives(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/incentives`, callback)
  }
  /**
   * returns leaderboards for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getLeaderboards(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/leaderboards`, callback)
  }
  /**
   * returns registrations for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getRegistrations(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/registrations`, callback)
  }
  /**
   * returns a registration fields for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getRegistrationFields(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/registration-fields`, callback)
  }
  /**
   * returns a schedule for a fundraising event
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getSchedule(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/schedule`, callback)
  }
  /**
   *
   * @param {string} id fundraising event id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getVisibilityOptions(id: string, callback: (results: any) => void) {
    this._sendRequest(`fundraising-events/${id}/visibility-options`, callback)
  }
}

export default FundraisingEvents;
