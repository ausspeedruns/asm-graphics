import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

import { Tweet } from './tweet';

import type NodeCG from '@alvancamp/test-nodecg-types';
import { Tweet as ITweet } from '@asm-graphics/types/Twitter';

const SponsorsContainer = styled.img`
	object-fit: contain;
	z-index: 3;
	height: 100%;
	width: 100%;
`;

interface Props {
	sponsors?: NodeCG.AssetFile[];
	start?: number;
	style?: React.CSSProperties;
	className?: string;
}

const AD_LENGTH = 30;

export const Sponsors: React.FC<Props> = (props: Props) => {
	const [imgIndex, setImgIndex] = useState(props.start || 1);
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		// Change this to a tl loop
		const interval = setInterval(() => {
			// Runs every 30 seconds
			const tl = gsap.timeline();
			tl.to(imageRef.current, { duration: 1, opacity: 0 });
			tl.call(() => {
				if (imageRef.current && props.sponsors) {
					imageRef.current.src = props.sponsors[imgIndex]?.url;
				}
			});
			tl.to(imageRef.current, { duration: 1, opacity: 1 }, '+=0.5');
			tl.call(() => {
				if (!props.sponsors) return;
				setImgIndex(imgIndex + 1 >= props.sponsors.length ? 0 : imgIndex + 1);
			});
		}, 1000 * AD_LENGTH);
		return () => clearInterval(interval);
	}, [imgIndex, props.sponsors]);

	if (!props.sponsors || props.sponsors.length === 0) {
		return <></>;
	}

	return (
		<SponsorsContainer
			ref={imageRef}
			className={props.className}
			style={props.style}
			src={props.sponsors[props.start || 0].url}
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
	sponsors: NodeCG.AssetFile[];
	style?: React.CSSProperties;
	className?: string;
	sponsorStyle?: React.CSSProperties;
	tweetStyle?: React.CSSProperties;
}

export interface SponsorBoxRef {
	showTweet?: (newVal: ITweet) => void;
}

const TweetBox = styled.div`
	opacity: 0;
	margin-top: -10px;
	position: absolute;
`;

export const SponsorsBox = forwardRef<SponsorBoxRef, FullBoxProps>((props, ref) => {
	const sponsorMainRef = useRef<HTMLDivElement>(null);
	const tweetRef = useRef<HTMLDivElement>(null);
	const [tweet, setTweet] = useState<ITweet | undefined>(undefined);

	useImperativeHandle(ref, () => ({
		showTweet(newVal: ITweet) {
			setTweet(newVal);
			const tl = gsap.timeline();
			tl.set(tweetRef.current, { opacity: 0 });
			tl.to(sponsorMainRef.current, { opacity: 0, duration: 1 });
			tl.to(tweetRef.current, { opacity: 1, duration: 1 });
			tl.to(tweetRef.current, { opacity: 0, duration: 1 }, '+=10');
			tl.to(sponsorMainRef.current, { opacity: 1, duration: 1 });
		},
	}));
	//

	return (
		<SponsorsBoxContainer className={props.className} style={props.style}>
			<div ref={sponsorMainRef} style={props.sponsorStyle}>
				<Sponsors sponsors={props.sponsors} />
			</div>
			<TweetBox ref={tweetRef} style={props.tweetStyle}>
				<Tweet tweet={tweet} />
			</TweetBox>
		</SponsorsBoxContainer>
	);
});
