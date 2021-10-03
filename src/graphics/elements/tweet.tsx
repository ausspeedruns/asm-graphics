import React from 'react';
import styled from 'styled-components';
import _ from 'underscore';
// @ts-ignore
import Twemoji from 'react-twemoji';

import { Tweet as ITweet } from '../../types/Twitter';

const TweetContainer = styled.div`
	position: absolute;
	color: #F2DAB2;
	margin: 15px;
	border-top: 1px solid #F2DAB2;
	border-right: 1px solid #F2DAB2;
	border-left: 1px solid #F2DAB2;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	height: 100%;
	font-family: National Park;
`;

const Text = styled.div`
	padding: 13px 20px;
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

const BottomBorderCont = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: -10px;
	position: absolute;
	bottom: -1px;
	width: 100%;
`;

const BottomBorder = styled.div`
	height: 1px;
	background: #F2DAB2;
	min-width: 15px;
`;

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

export const Tweet: React.FC<Props> = (props: Props) => {

	
	if (typeof props.tweet === 'undefined') {
		return <></>;
	}
	
	const dangerBold = () => {
		if (props.tweet) {
			const tweetText = props.tweet.data.text.replace('#PAXxAusSpeedruns2021', '<b>#PAXxAusSpeedruns2021</b>');
	
			return {__html: _.unescape(tweetText)};
		}

		return {__html: ''};
	};

	return (
		<TweetContainer className={props.className} style={props.style}>
			<Twemoji noWrapper={true}>
				<Text dangerouslySetInnerHTML={dangerBold()}></Text>
			</Twemoji>
			<BottomBorderCont>
				<BottomBorder style={{ flexGrow: 1 }} />
				<TwitterLogo src={'../shared/design/Twitter white.svg'} />
				<Username>@{props.tweet.includes.users[0].username}</Username>
				<BottomBorder />
			</BottomBorderCont>
		</TweetContainer>
	);
};
