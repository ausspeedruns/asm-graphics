import TiltifyClient from './tiltify-api';

class Cause {
  _sendRequest: (path: string, callback: (results: any) => void) => Promise<void>;
  _doRequest: (path: string) => Promise<any>;
  apiKey: string;

  /**
   * A new cause api object.
   * @param {object} self is `this` from index.js
   * @constructor
   */
  constructor (self: TiltifyClient) {
    this._sendRequest = self._sendRequest
    this._doRequest = self._doRequest
    this.apiKey = self.apiKey
  }
  /**
   * returns info about a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  get (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}`, callback)
  }
  /**
   * returns campaigns for a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getCampaigns (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}/campaigns`, callback)
  }
  /**
   * returns donations for a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getDonations (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}/donationss`, callback)
  }
  /**
   * returns fundraising events for a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getFundraisingEvents (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}/fundraising-events`, callback)
  }
  /**
   * returns leaderboards for a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getLeaderboards (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}/leaderboards`, callback)
  }
  /**
   * returns visibility options for a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getVisibilityOptions (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}/visibility-options`, callback)
  }
  /**
   * returns permissions for a cause
   * @param {string} id cause id to look up
   * @param {requestCallback} callback a function to call when we're done getting data
   */
  getPermissions (id: string, callback: (results: any) => void) {
    this._sendRequest(`causes/${id}/permissions`, callback)
  }
}

export default Cause;
