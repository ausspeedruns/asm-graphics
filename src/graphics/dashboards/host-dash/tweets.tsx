// Copy paste from dashboard version
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useReplicant, useListenFor } from "@nodecg/react-hooks";
import _ from "underscore";

import { Tweet } from "@asm-graphics/types/Twitter";

import { GreenButton, RedButton } from "../../../dashboard/elements/styled-ui";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete, Undo } from "@mui/icons-material";

const ncgConfig = nodecg.bundleConfig;

const TwitterContainer = styled.div`
	height: calc(100% - 56px);
	overflow-y: auto;
	overflow-x: hidden;
`;

const NoTweetsMsg = styled.span`
	font-weight: bold;
	color: black;
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 62px;
	font-size: 30px;
`;

const TopBar = styled(Box)`
	height: 40px;
	padding: 5px;
	box-sizing: border-box;
	width: 100%;
	background-color: #c7c7c7;
`;

/*
const fakeTweet: Tweet = {
	data: {
		authorID: '105261155',
		id: '1317382179320627201',
		createdAt: '2020-10-26T07:17:29.000Z',
		text:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pellentesque dignissim elementum. Aliquam risus elit, commodo eu ultrices eu, ornare quis mi. Morbi varius magna augue, et rutrum dolor interdum sit amet. Integer tristique magna vitae mollis auctor. Class #PAXxAusSpeedruns2021',
	},
	includes: { users: [{ id: '105261155', name: 'Ewan Lyon', username: 'Clubwhom' }] },
	matchingRules: [{ id: 1, tag: 'Event Hashtag' }],
}; */

export const Twitter: React.FC = () => {
	const [tweetList] = useReplicant<Tweet[]>("tweets", []);
	const [canUndo, setCanUndo] = useState(false);
	const [showingTweet, setShowingTweet] = useState<Tweet | undefined>(undefined);
	const [showDialog, setShowDialog] = useState(false);
	const [agreeDisabled, setAgreeDisabled] = useState(true);

	let tweets: JSX.Element[] = [];
	if (tweetList) {
		tweets = tweetList.map((tweet) => {
			return <SingleTweet key={tweet.data.id} tweet={tweet} />;
		});
	}

	let noTweets;
	if (!(ncgConfig.twitter as any).enabled) {
		noTweets = <NoTweetsMsg>Twitter is not enabled</NoTweetsMsg>;
	} else if (!tweetList) {
		noTweets = <NoTweetsMsg>There are no recent tweets :(</NoTweetsMsg>;
	}

	useListenFor("discardTweet", () => {
		setCanUndo(true);
	});

	useListenFor("showPotentialTweet", (tweet) => {
		setShowingTweet(tweet);
		setShowDialog(true);
		setAgreeDisabled(true);
		setTimeout(() => {
			setAgreeDisabled(false);
		}, 5000);
	});

	const hideDialog = () => {
		setShowDialog(false);
		setAgreeDisabled(true);
	};

	const showTweet = () => {
		if (showingTweet) nodecg.sendMessage("showTweet", showingTweet);
		hideDialog();
	};

	return (
		<TwitterContainer>
			<TopBar boxShadow={5}>
				<Button
					variant="contained"
					size="small"
					onClick={() => {
						nodecg.sendMessage("refresh-tweets");
					}}
				>
					Refresh
				</Button>
				<Button
					style={{ float: "right" }}
					variant="contained"
					size="small"
					disabled={!canUndo}
					startIcon={<Undo />}
					onClick={() => {
						nodecg.sendMessage("undoTweetDeletion");
						setCanUndo(false);
					}}
				>
					Undo
				</Button>
			</TopBar>
			<div style={{ padding: 8 }}>{tweets.length === 0 ? noTweets : tweets.reverse()}</div>
			<Dialog open={showDialog} onClose={hideDialog}>
				<DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
				<DialogContent>
					<DialogContentText>Are you sure you want to show this tweet?</DialogContentText>
					<SingleTweet tweet={showingTweet} hideButtons />
				</DialogContent>
				<DialogActions>
					<Button onClick={hideDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={showTweet} color="primary" disabled={agreeDisabled} autoFocus>
						Show
					</Button>
				</DialogActions>
			</Dialog>
		</TwitterContainer>
	);
};

const NewFlash = keyframes`
	from { background-color: #303030; }
	to { background-color: var(--inset-background); }
`;

const SingleTweetContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	background-color: var(--inset-background);
	padding: 8px;
	border-radius: 7px;
	animation-name: ${NewFlash};
	animation-duration: 0.5s;
`;

const Data = styled.div`
	display: flex;
	flex-direction: column;
`;

const Username = styled.span`
	font-weight: bold;
`;

const Time = styled.span`
	margin-right: 6px;
	color: #aaa;
`;

const Text = styled.span``;

interface SingleTweetProps {
	tweet: Tweet | undefined;
	hideButtons?: boolean;
}

const SingleTweet: React.FC<SingleTweetProps> = (props: SingleTweetProps) => {
	if (!props.tweet) return <></>;

	const showTweet = () => {
		nodecg.sendMessage("showPotentialTweet", props.tweet);
	};

	const deleteTweet = () => {
		nodecg.sendMessage("discardTweet", props.tweet?.data.id ?? "");
	};

	const tweetCreatedAt = new Date(props.tweet.data.created_at);

	return (
		<SingleTweetContainer boxShadow={2}>
			<Data>
				<div>
					<Time>{tweetCreatedAt.toLocaleTimeString("en-AU")}</Time>
					<Username>@{props.tweet.includes.users[0].username}</Username>
				</div>
				<Text>{_.unescape(props.tweet.data.text)}</Text>
			</Data>
			{props.hideButtons ? (
				<></>
			) : (
				<div style={{ display: "flex" }}>
					<RedButton style={{ height: "100%", marginRight: 4 }} variant="contained" onClick={deleteTweet}>
						<Delete />
					</RedButton>
					<GreenButton variant="contained" onClick={showTweet}>
						Show
					</GreenButton>
				</div>
			)}
		</SingleTweetContainer>
	);
};
