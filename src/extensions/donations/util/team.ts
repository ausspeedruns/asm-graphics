import TiltifyClient from './tiltify-api';

class Team {
  _sendRequest: (path: string, callback: (results: any) => void) => Promise<void>;
  _doRequest: (path: string) => Promise<any>;
  apiKey: string;

  /**
   * A new team api object.
   * @param {object} self is `this` from index.js
   * @constructor
   */
  constructor (self: TiltifyClient) {
    this._sendRequest = self._sendRequest
    this._doRequest = self._doRequest
    this.apiKey = self.apiKey
  }

  /**
   * returns a list of teams
   * @param {requestCallback} callback
   */
  list (callback: any) {
    this._sendRequest(`teams`, callback)
  }

  /**
   * returns info about a team
   * @param {string} id the team id to look up
   * @param {requestCallback} callback a function to call when data is returned
   */
  get (id: string, callback: any) {
    this._sendRequest(`teams/${id}`, callback)
  }

  /**
   * returns campaigns for a team
   * @param {string} id the team id to look up
   * @param {*} callback a function to call when data is returned
   */
  getCampaigns (id: string, callback: any) {
    this._sendRequest(`teams/${id}/campaigns`, callback)
  }

  /**
   * returns a info about a campaign attached to a team
   * @param {string} teamid the team id to look up
   * @param {string} campaignid the campaign id to look up
   * @param {string} callback a function to call when data is returned
   */
  getCampaign (teamid: string, campaignid: string, callback: any) {
    this._sendRequest(`teams/${teamid}/campaigns/${campaignid}`, callback)
  }
}

export default Team;
