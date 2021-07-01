"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("../nodecg-api-context"));
const needle_1 = tslib_1.__importDefault(require("needle"));
const nodecg = nodecgApiContext.get();
const ncgTwitterConfig = nodecg.bundleConfig.twitter;
const token = ncgTwitterConfig.bearer || '';
const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';
const streamParameters = [
    'expansions=author_id',
    'user.fields=username',
    'tweet.fields=created_at'
];
const twitterSearch = [
    'expansions=author_id',
    'user.fields=username',
    'tweet.fields=created_at',
    'query=%23ASM2021'
];
// Edit rules as desired here below
const rules = ncgTwitterConfig.rules;
async function getAllRules() {
    const response = await needle_1.default('get', rulesURL, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    });
    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }
    return (response.body);
}
async function deleteAllRules(rules) {
    if (!Array.isArray(rules.data)) {
        return null;
    }
    const ids = rules.data.map(rule => rule.id);
    const data = {
        'delete': {
            'ids': ids
        }
    };
    const response = await needle_1.default('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    });
    if (response.statusCode !== 200) {
        throw new Error(response.body);
        return null;
    }
    return (response.body);
}
async function setRules() {
    const data = {
        'add': rules
    };
    const response = await needle_1.default('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    });
    if (response.statusCode !== 201) {
        throw new Error(response.body);
        return null;
    }
    return (response.body);
}
function streamConnect() {
    // Listen to the stream
    const options = {
        timeout: 20000,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const streamURLwQuery = `${streamURL}?${streamParameters.join('&')}`;
    const stream = needle_1.default.get(streamURLwQuery, options);
    stream.on('data', data => {
        try {
            const json = JSON.parse(data);
            // Skip retweets
            if (json.data.text.substr(0, 4) === 'RT @')
                return;
            nodecg.sendMessage('newTweet', json);
            // nodecg.log.info(`New Tweet from @${json.includes.users[0].username}: ${json.data.text}`);
            // console.log(JSON.stringify(json));
            // console.log(json.includes.users);
        }
        catch (e) {
            // Keep alive signal received. Do nothing.
        }
    }).on('error', error => {
        if (error.code === 'ETIMEDOUT') {
            stream.emit('timeout');
        }
    });
    return stream;
}
function firstTimeLoad() {
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const streamURLwQuery = `https://api.twitter.com/2/tweets/search/recent?${twitterSearch.join('&')}`;
    needle_1.default.get(streamURLwQuery, options, (err, _res, body) => {
        if (err) {
            nodecg.log.error('Twitter first time search fail: ' + err.message);
            return;
        }
        body.data.forEach((tweet) => {
            // Skip retweets
            if (tweet.text.substr(0, 4) === 'RT @')
                return;
            // console.log(JSON.stringify(tweet))
            const tweetAuthor = body.includes.users.find((author) => author.id === tweet.author_id);
            const normalisedTweet = {
                data: tweet,
                includes: {
                    users: [tweetAuthor]
                },
                matchingRules: []
            };
            nodecg.sendMessage('newTweet', normalisedTweet);
        });
    });
}
(async () => {
    let currentRules;
    try {
        // Gets the complete list of rules currently applied to the stream
        currentRules = await getAllRules();
        // Delete all rules. Comment the line below if you want to keep your existing rules.
        await deleteAllRules(currentRules);
        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        await setRules();
    }
    catch (e) {
        nodecg.log.error('Twitter error: ' + JSON.stringify(e));
    }
    // Listen to the stream.
    // This reconnection logic will attempt to reconnect when a disconnection is detected.
    // To avoid rate limites, this logic implements exponential backoff, so the wait time
    // will increase if the client cannot reconnect to the stream.
    firstTimeLoad();
    const filteredStream = streamConnect();
    let timeout = 0;
    filteredStream.on('timeout', () => {
        // Reconnect on error
        nodecg.log.warn('Twitter connection error occurred. Reconnecting…');
        setTimeout(() => {
            timeout++;
            streamConnect();
        }, 2 ** timeout);
        streamConnect();
    });
})();