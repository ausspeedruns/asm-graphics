import React, { useImperativeHandle, useRef } from "react";
import styled from "styled-components";

import { TickerItemHandles } from "./incentives";

import WebsiteIcon from "../../media/icons/website.svg";
import YouTubeIcon from "../../media/icons/youtube.svg";
import DiscordIcon from "../../media/icons/discord.svg";
import TwitterIcon from "../../media/icons/twitter.svg";
import TwitchIcon from "../../media/icons/TwitchWhite.svg";

const SocialsContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	transform: translate(-100%, 0);
	padding: 16px;
	box-sizing: border-box;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20px;
`;

const SocialBar = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: var(--secondary-font);
	gap: 32px;
	font-size: 40px;
`;

const SocialIcon = styled.img`
	height: 40px;
	width: 40px;
	object-fit: contain;
`;

const TRANSITION_SPEED = 2;
const ITEM_HOLD_DURATION = 10;
const STAGGER_AMOUNT = 0.05;

export const Socials = React.forwardRef<TickerItemHandles>((_, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const staggerElements = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.addLabel("socialsStagger");
			tl.set(containerRef.current, { xPercent: 100 });
			staggerElements.current.reverse().forEach((prizeRef) => {
				tl.add(prizeRef.animation(tl));
			});
			return tl;
		},
	}));

	return (
		<SocialsContainer ref={containerRef}>
			<Stagger ref={(el) => (staggerElements.current[0] = el!)} index={0}>
				<SocialBar>
					<SocialIcon src={WebsiteIcon} />
					AusSpeedruns.com
				</SocialBar>
			</Stagger>
			<Stagger ref={(el) => (staggerElements.current[1] = el!)} index={1}>
				<SocialBar>
					<SocialIcon src={TwitterIcon} /> @AusSpeedruns
				</SocialBar>
			</Stagger>
			<Stagger ref={(el) => (staggerElements.current[2] = el!)} index={2}>
				<SocialBar>
					<SocialIcon src={TwitchIcon} /> @AusSpeedruns
				</SocialBar>
			</Stagger>
			<Stagger ref={(el) => (staggerElements.current[3] = el!)} index={3}>
				<SocialBar>
					<SocialIcon src={YouTubeIcon} /> @AusSpeedruns
				</SocialBar>
			</Stagger>
			<Stagger ref={(el) => (staggerElements.current[4] = el!)} index={4}>
				<SocialBar>
					<SocialIcon src={DiscordIcon} /> Discord.AusSpeedruns.com
				</SocialBar>
			</Stagger>
		</SocialsContainer>
	);
});

Socials.displayName = "Socials";

const StaggerContainer = styled.div`
	display: flex;
	width: calc(100% - 48px);
`;

interface PrizeProps {
	children?: React.ReactNode;
	index: number;
}

const Stagger = React.forwardRef<TickerItemHandles, PrizeProps>((props: PrizeProps, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		animation: (tl) => {
			tl.fromTo(
				containerRef.current,
				{ xPercent: -110 },
				{ xPercent: 0, duration: TRANSITION_SPEED, ease: "power3.out" },
				`socialsStagger+=${props.index / (1 / STAGGER_AMOUNT)}`,
			);

			tl.to(
				containerRef.current,
				{ xPercent: 110, duration: TRANSITION_SPEED, ease: "power3.in" },
				`socialsStagger+=${props.index / (1 / STAGGER_AMOUNT) + ITEM_HOLD_DURATION}`,
			);
			return tl;
		},
	}));

	return <StaggerContainer ref={containerRef}>{props.children}</StaggerContainer>;
});
