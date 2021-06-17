import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { useListenFor, useReplicant } from 'use-nodecg';

import { Tweet } from './tweet';

import { Tweet as ITweet } from '../../types/Twitter';

const SponsorsContainer = styled.img`
	object-fit: contain;
	z-index: 3;
	height: 100%;
	width: 100%;
`;

interface Asset {
	base: string;
	bundleName: string;
	category: string;
	ext: string;
	name: string;
	sum: string;
	url: string;
}

interface Props {
	start?: number;
	style?: React.CSSProperties;
	className?: string;
}

export const Sponsors: React.FC<Props> = (props: Props) => {
	const [imgIndex, setImgIndex] = useState(props.start || 1);
	const [sponsorAsset] = useReplicant<Asset[], []>('assets:sponsors', []);
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		// Change this to a tl loop
		const interval = setInterval(() => {
			// Runs every 30 seconds
			const tl = gsap.timeline();
			tl.to(imageRef.current, { duration: 1, opacity: 0 });
			tl.call(() => {
				if (imageRef.current) {
					imageRef.current.src = sponsorAsset[imgIndex].url;
				}
			});
			tl.to(imageRef.current, { duration: 1, opacity: 1 }, '+=0.5');
			tl.call(() => {
				if (imgIndex + 1 >= sponsorAsset.length) {
					setImgIndex(0);
				} else {
					setImgIndex(imgIndex + 1);
				}
			});
		}, 1000 * 30);
		return () => clearInterval(interval);
	}, [sponsorAsset, imgIndex]);

	if (sponsorAsset.length === 0) {
		return <></>;
	}

	return (
		<SponsorsContainer
			ref={imageRef}
			className={props.className}
			style={props.style}
			src={sponsorAsset[props.start || 0].url}
		/>
	);
};

const SponsorsBoxContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

interface FullBoxProps {
	// tweet: ITweet;
	style?: React.CSSProperties;
	className?: string;
	sponsorStyle?: React.CSSProperties;
	tweetStyle?: React.CSSProperties;
}

const TweetBox = styled.div`
	opacity: 0;
	margin-top: -10px;
	position: absolute;
`;

export const SponsorsBox: React.FC<FullBoxProps> = (props: FullBoxProps) => {
	const sponsorMainRef = useRef<HTMLDivElement>(null);
	const tweetRef = useRef<HTMLDivElement>(null);
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);

	useListenFor('showTweet', (newVal: ITweet) => {
		console.log(newVal);
		setTweet(newVal);
		const tl = gsap.timeline();
		tl.set(tweetRef.current, { opacity: 0 });
		tl.to(sponsorMainRef.current, { opacity: 0, duration: 1 });
		tl.to(tweetRef.current, { opacity: 1, duration: 1 });
		// tl.to(tweetRef.current, { opacity: 0, duration: 1 }, '+=10');
		// tl.to(sponsorMainRef.current, { opacity: 1, duration: 1 });
	});

	return (
		<SponsorsBoxContainer className={props.className} style={props.style}>
			<div ref={sponsorMainRef} style={props.sponsorStyle}>
				<Sponsors />
			</div>
			<TweetBox ref={tweetRef} style={props.tweetStyle}>
				<Tweet tweet={tweet} />
			</TweetBox>
		</SponsorsBoxContainer>
	);
};
