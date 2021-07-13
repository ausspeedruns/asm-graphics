"use strict";
/* eslint-disable camelcase */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Modified version of https://developers.google.com/sheets/api/quickstart/nodejs
// Modified to use NodeCG config and Replicants
const nodecgApiContext = tslib_1.__importStar(require("../nodecg-api-context"));
const googleapis_1 = require("googleapis");
const nodecg = nodecgApiContext.get();
const ncgGoogleConfig = nodecg.bundleConfig.googleCredentials;
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const googleTokenRep = nodecg.Replicant('googleToken');
const incentivesRep = nodecg.Replicant('incentives');
// Load client secrets from a local file.
if (ncgGoogleConfig.enabled) {
    runAuth();
}
else {
    nodecg.log.info('Google API not enabled. Incentives will not work');
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    if (googleTokenRep.value) {
        oAuth2Client.setCredentials(googleTokenRep.value);
        callback(oAuth2Client);
    }
    else {
        getNewToken(oAuth2Client);
    }
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    nodecg.log.info('Authorize this app by visiting this url:', authUrl);
    // const rl = readline.createInterface({
    // 	input: process.stdin,
    // 	output: process.stdout,
    // });
    // rl.question('Enter the code from that page here: ', (code) => {
    // 	rl.close();
    // 	oAuth2Client.getToken(code, (err: any, token: any) => {
    // 		if (err) return nodecg.log.error('Error while trying to retrieve access token', err);
    // 		oAuth2Client.setCredentials(token);
    // 		// Store the token to disk for later program executions
    // 		googleTokenRep.value = token;
    // 		callback(oAuth2Client);
    // 	});
    // });
}
/**
 * Live: 192nms5HjWe6li2XwmV1-l0W0_8csRv6Jyc944ir3tVY
 * Live: https://docs.google.com/spreadsheets/d/192nms5HjWe6li2XwmV1-l0W0_8csRv6Jyc944ir3tVY/edit
 * Testing: 1_djrHMH-dGlig_mYz0cFr41Cu8hHGnVsnpOIuCNdb5A
 * Testing: https://docs.google.com/spreadsheets/d/1_djrHMH-dGlig_mYz0cFr41Cu8hHGnVsnpOIuCNdb5A/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getAllData(auth) {
    const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: ncgGoogleConfig.spreadsheet,
        range: 'Main Sheet'
    }, (err, res) => {
        if (err)
            return nodecg.log.info('The API returned an error: ' + err);
        const rows = res === null || res === void 0 ? void 0 : res.data.values;
        if (!rows) {
            runAuto = false;
            nodecg.log.error('Failed retrieving incentive rows. Trying again in 5 seconds...');
            nodecg.sendMessage('incentivesUpdated', 400);
            setTimeout(runAuth, 5000);
            return;
        }
        runAuto = true;
        rows.forEach((row, index) => {
            const newIncentive = parseIncentive(row, index);
            if (!newIncentive)
                return;
            // Find incentive based on id
            const existingIncentiveIndex = incentivesRep.value.findIndex(incentive => {
                return newIncentive.index === incentive.index;
            });
            if (existingIncentiveIndex === -1) {
                // New index
                incentivesRep.value.push(newIncentive);
            }
            else {
                // Change object to new one if different
                if (JSON.stringify(existingIncentiveIndex) === JSON.stringify(incentivesRep.value[existingIncentiveIndex])) {
                    return;
                }
                incentivesRep.value[existingIncentiveIndex] = newIncentive;
            }
        });
        const sortedIncentives = [...incentivesRep.value].sort((a, b) => a.index - b.index);
        incentivesRep.value = sortedIncentives;
        nodecg.sendMessage('incentivesUpdated', 200);
    });
}
const GoalRegex = /\$\d+\.?\d* \/ \$\d+\.?\d*/; // e.g. $50.85 / $150
const WarRegex = /.+: \$\d+\.?\d*/; // e.g. Hat Kid: $100
const ActiveRegex = /Open/;
let runAuto = true;
function parseIncentive(row, rowIndex) {
    let incentive;
    const active = row[5] ? ActiveRegex.test(row[5]) : false;
    switch (row[4]) {
        case 'Goal': {
            // Test regex
            if (!GoalRegex.test(row[6])) {
                nodecg.log.error(`Failed parsing goal incentive: ${row[1]} | ${row[2]}. "${row[5]}" failed regex. Skipping...`);
                return;
            }
            // Split the text, remove the $ sign, parse as float
            const total = parseFloat(row[6].split(' / ')[0].substring(1));
            const goal = parseFloat(row[6].split(' / ')[1].substring(1));
            incentive = {
                active: active,
                type: 'Goal',
                game: row[1],
                incentive: row[2],
                notes: row[3],
                goal: goal,
                total: total,
                index: rowIndex
            };
            break;
        }
        case 'War': {
            const options = [];
            // Test regex
            for (let i = 6; i < row.length; i++) {
                if (!WarRegex.test(row[i])) {
                    // Remove the pokemon one
                    if (row[i] === 'Options to be determined via twitter poll and voted on via twitter later') {
                        break;
                    }
                    nodecg.log.error(`Failed parsing war incentive: ${row[1]} | ${row[2]}. ${i}: "${row[i]}" failed regex. Skipping...`);
                    break;
                }
                const name = row[i].split(':')[0];
                const total = parseFloat(row[i].split(':')[1].substring(2));
                options.push({ name: name, total: total });
            }
            options.sort((a, b) => {
                return a.total - b.total;
            });
            incentive = {
                type: 'War',
                active: active,
                game: row[1],
                incentive: row[2],
                notes: row[3],
                options: options,
                index: rowIndex
            };
            break;
        }
        default:
            break;
    }
    return incentive;
}
function runAuth() {
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(ncgGoogleConfig.installed, getAllData);
}
setInterval(() => {
    if (runAuto) {
        runAuth();
    }
}, 30000);
nodecg.listenFor('updateIncentives', () => {
    runAuth();
});
nodecg.listenFor('google-newcred', (newCred) => {
    const { client_secret, client_id, redirect_uris } = ncgGoogleConfig.installed;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.getToken(newCred, (err, token) => {
        if (err)
            return nodecg.log.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        googleTokenRep.value = token;
    });
    runAuth();
});
