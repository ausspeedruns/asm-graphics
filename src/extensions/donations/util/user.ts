import TiltifyClient from './tiltify-api';

class User {
  _sendRequest: (path: string, callback: (results: any) => void) => Promise<void>;
  _doRequest: (path: string) => Promise<any>;
  apiKey: string;

  /**
   * A new user api object.
   * @param {object} self is `this` from index.js
   * @constructor
   */
  constructor (self: TiltifyClient) {
    this._sendRequest = self._sendRequest
    this._doRequest = self._doRequest
    this.apiKey = self.apiKey
  }
  /**
   * returns your own user
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  self (callback: (results: any) => void) {
    this._sendRequest(`user`, callback)
  }
  /**
   * returns a list of users
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  list (callback: (results: any) => void) {
    this._sendRequest(`users`, callback)
  }
  /**
   * returns a specific user's profile
   * @param {string} id the user id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  get (id: string, callback: (results: any) => void) {
    this._sendRequest(`users/${id}`, callback)
  }
  /**
   * returns campaigns for a user
   * @param {string} id the user id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getCampaigns (id: string, callback: (results: any) => void) {
    this._sendRequest(`users/${id}/campaigns`, callback)
  }
  /**
   * returns an individual campaign for a user
   * @param {string} userid the user to look up
   * @param {string} campaignid the campaign to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getCampaign (userid: string, campaignid: string, callback: (results: any) => void) {
    this._sendRequest(`users/${userid}/campaigns/${campaignid}`, callback)
  }
  /**
   * returns all teams a user owns
   * @param {string} id the user to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getOwnedTeams (id: string, callback: (results: any) => void) {
    this._sendRequest(`users/${id}/owned-teams`, callback)
  }
  /**
   * get teams a user is part of
   * @param {string} id the user to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getTeams (id: string, callback: (results: any) => void) {
    this._sendRequest(`users/${id}/teams`, callback)
  }
}

export default User;
