import React from 'react';
import styled from 'styled-components';
import _ from 'underscore';
// @ts-ignore
import Twemoji from 'react-twemoji';

import { Tweet as ITweet } from '@asm-graphics/types/Twitter';

const TweetContainer = styled.div`
	position: absolute;
	color: var(--text-light);
	margin: 15px;
	border: 1px solid #ffffff;
	background-color: var(--main);
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	font-family: var(--main-font);
	border: 1px solid var(--sec);
`;

const Text = styled.div`
	padding: 13px 20px;
	padding-top: 0;
	text-align: center;

	& .emoji {
		height: 1em;
		width: 1em;
		margin: 0 0.05em 0 0.1em;
		vertical-align: -0.1em;
	}
`;

const Username = styled.span`
	font-weight: bold;
	font-size: 16px;
	margin-right: 6px;
`;

// const BottomBorderCont = styled.div`
// 	display: flex;
// 	align-items: center;
// 	margin-bottom: -10px;
// 	position: absolute;
// 	bottom: -1px;
// 	width: 100%;
// `;

// const BottomBorder = styled.div`
// 	height: 1px;
// 	background: #ffffff;
// 	min-width: 15px;
// `;

const TwitterLogo = styled.img`
	height: 22px;
	width: auto;
	margin: 0 6px;
`;

interface Props {
	tweet: ITweet | undefined;
	style?: React.CSSProperties;
	className?: string;
}

const twitterImgRegex = new RegExp(/https:\/\/t\.co\/\w*/);

export const Tweet: React.FC<Props> = (props: Props) => {
	if (typeof props.tweet === 'undefined') {
		return <></>;
	}

	const dangerBold = () => {
		if (props.tweet) {
			let tweetText = props.tweet.data.text.replace('#ASM2022', '<b>#ASM2022</b>');
			tweetText = tweetText.replace(twitterImgRegex, ' ');

			return { __html: _.unescape(tweetText) };
		}

		return { __html: '' };
	};

	return (
		<TweetContainer className={props.className} style={props.style}>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 13 }}>
				<TwitterLogo src={'../shared/design/Twitter white.svg'} />
				<Username>@{props.tweet.includes.users[0].username}</Username>
			</div>
			<Twemoji noWrapper={true}>
				<Text dangerouslySetInnerHTML={dangerBold()}></Text>
			</Twemoji>
			{/* <BottomBorderCont>
				<BottomBorder style={{ flexGrow: 1 }} />
				<TwitterLogo src={'../shared/design/Twitter white.svg'} />
				<Username>@{props.tweet.includes.users[0].username}</Username>
				<BottomBorder />
			</BottomBorderCont> */}
		</TweetContainer>
	);
};
