"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const bad_words_1 = tslib_1.__importDefault(require("bad-words"));
const nodecg = nodecgApiContext.get();
const tweetsRep = nodecg.Replicant('tweets');
let deletedTweet = null;
// Arbitrary number but we only want to keep the latest tweets
const MAXSAVEDTWEETS = 15;
const filter = new bad_words_1.default();
nodecg.listenFor('newTweet', (newVal) => {
    // If the tweet has any bad words just dont even bother doing anything
    if (filter.isProfane(newVal.data.text) || filter.isProfane(newVal.includes.users[0].username))
        return;
    const currentTweetList = [...tweetsRep.value];
    // Remove the oldest tweet
    if (currentTweetList.length >= MAXSAVEDTWEETS) {
        currentTweetList.shift();
    }
    currentTweetList.push(newVal);
    tweetsRep.value = currentTweetList;
});
nodecg.listenFor('discardTweet', (id) => {
    const currentTweetList = [...tweetsRep.value];
    const index = currentTweetList.findIndex(tweet => tweet.data.id === id);
    if (index > -1) {
        deletedTweet = currentTweetList[index];
        currentTweetList.splice(index, 1);
    }
    else {
        nodecg.log.warn(`Could not find tweet id ${id} when trying to remove`);
        return;
    }
    tweetsRep.value = currentTweetList;
});
nodecg.listenFor('undoTweetDeletion', () => {
    const currentTweetList = [...tweetsRep.value];
    if (deletedTweet) {
        currentTweetList.push(deletedTweet);
    }
    tweetsRep.value = currentTweetList;
});
