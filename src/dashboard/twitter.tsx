import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import styled, { keyframes } from "styled-components";
import { useReplicant, useListenFor } from "use-nodecg";
import _ from "underscore";

import { DeepReadonly } from "@nodecg/types/faux_modules/ts-essentials";
import { Tweet } from "@asm-graphics/types/Twitter";
import { ConfigSchema } from "@asm-graphics/types/ConfigSchema";

import { GreenButton, RedButton } from "./elements/styled-ui";
import { Box, Button } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import Delete from "@mui/icons-material/Delete";

const ncgConfig = nodecg.bundleConfig as DeepReadonly<ConfigSchema>;

const TwitterContainer = styled.div`
	height: 235px;
	overflow: auto;
	font-family:
		Noto Sans,
		sans-serif;
`;

const NoTweetsMsg = styled.span`
	font-weight: bold;
	color: #697998;
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
	background-color: #4d5e80;
`;

const fakeTweet: Tweet = {
	data: {
		authorID: "105261155",
		id: "1317382179320627201",
		created_at: "2020-10-26T07:17:29.000Z",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia nisl nulla, vitae tempus augue tincidunt sed. In eget enim eu nibh semper faucibus id at mauris. Integer posuere tempor magna vel vestibulum. In placerat purus magna, non porttitor lacus dapibus id. V #ASAP2022",
	},
	includes: { users: [{ id: "105261155", name: "Ewan Lyon", username: "Clubwhom" }] },
	matchingRules: [{ id: 1, tag: "Event Hashtag" }],
};

const Twitter: React.FC = () => {
	const [tweetList] = useReplicant<Tweet[], Tweet[]>("tweets", []);
	const [canUndo, setCanUndo] = useState<Boolean>(false);

	let tweets: JSX.Element[] = [<SingleTweet key={"Test"} tweet={fakeTweet} />];
	if (tweetList) {
		tweets = tweetList.map((tweet) => {
			return <SingleTweet key={tweet.data.id} tweet={tweet} />;
		});
	}
	tweets.push(<SingleTweet key={"Test"} tweet={fakeTweet} />);

	let noTweets;
	if (!ncgConfig.twitter.enabled) {
		noTweets = <NoTweetsMsg>Twitter is not enabled</NoTweetsMsg>;
	} else if (!tweetList) {
		noTweets = <NoTweetsMsg>There are no recent tweets :(</NoTweetsMsg>;
	}

	useListenFor("discardTweet", () => {
		setCanUndo(true);
	});

	return (
		<TwitterContainer>
			<TopBar boxShadow={5}>
				<Button
					style={{ float: "right" }}
					variant="contained"
					size="small"
					disabled={!canUndo}
					startIcon={<UndoIcon />}
					onClick={() => {
						nodecg.sendMessage("undoTweetDeletion");
						setCanUndo(false);
					}}
				>
					Undo
				</Button>
			</TopBar>
			{tweets.length === 0 ? noTweets : tweets.reverse()}
		</TwitterContainer>
	);
};

const NewFlash = keyframes`
	from { background-color: #8794ad; }
	to { background-color: #4d5e80; }
`;

const SingleTweetContainer = styled(Box)`
	margin: 6px 0;
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	background-color: #4d5e80;
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
	tweet: Tweet;
}

export const SingleTweet: React.FC<SingleTweetProps> = (props: SingleTweetProps) => {
	function showTweet() {
		nodecg.sendMessage("showTweet", props.tweet);
	}

	function deleteTweet() {
		nodecg.sendMessage("discardTweet", props.tweet.data.id);
	}

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
			<RedButton style={{ height: "100%", marginRight: 4 }} variant="contained" onClick={deleteTweet}>
				<Delete />
			</RedButton>
			<GreenButton variant="contained" onClick={showTweet}>
				Show
			</GreenButton>
		</SingleTweetContainer>
	);
};

createRoot(document.getElementById("root")!).render(<Twitter />);
