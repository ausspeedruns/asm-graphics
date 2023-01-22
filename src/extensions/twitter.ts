import * as nodecgApiContext from './nodecg-api-context';
import Filter from 'bad-words';

import { Tweet } from '@asm-graphics/types/Twitter';

const nodecg = nodecgApiContext.get();

const tweetsRep = nodecg.Replicant<Tweet[]>('tweets');
let deletedTweet: Tweet | null = null;

// Arbitrary number but we only want to keep the latest tweets
const MAXSAVEDTWEETS = 15;

const filter = new Filter();

nodecg.listenFor('newTweet', (newVal: Tweet) => {
	// If the tweet has any bad words just dont even bother doing anything
	if (filter.isProfane(newVal.data.text) || filter.isProfane(newVal.includes.users[0].username)) return;

	const currentTweetList = [...tweetsRep.value];

	// Remove the oldest tweet
	if (currentTweetList.length >= MAXSAVEDTWEETS) {
		currentTweetList.shift();
	}

	currentTweetList.push(newVal);
	tweetsRep.value = currentTweetList;
});

nodecg.listenFor('discardTweet', (id: string) => {
	const currentTweetList = [...tweetsRep.value];

	const index = currentTweetList.findIndex(tweet => tweet.data.id === id);

	if (index > -1) {
		deletedTweet = currentTweetList[index];
		currentTweetList.splice(index, 1);
	} else {
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
