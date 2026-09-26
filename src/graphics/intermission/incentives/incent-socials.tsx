import { useImperativeHandle, useRef } from "react";

import type { TickerItemHandles } from "../incentives";

import WebsiteIcon from "../../media/icons/website.svg";
import YouTubeIcon from "../../media/icons/youtube.svg";
import DiscordIcon from "../../media/icons/discord.svg";
import TwitterIcon from "../../media/icons/twitter.svg";
import TwitchIcon from "../../media/icons/TwitchWhite.svg";
import styles from "./incent-socials.module.css";

const TRANSITION_SPEED = 2;
const ITEM_HOLD_DURATION = 10;
const STAGGER_AMOUNT = 0.05;

interface SocialsProps {
	ref?: React.Ref<TickerItemHandles>;
}

export function Socials(props: SocialsProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const staggerElements = useRef<TickerItemHandles[]>([]);

	useImperativeHandle(props.ref, () => ({
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
		<div className={styles.socialsContainer} ref={containerRef}>
			<Stagger
				ref={(el) => {
					staggerElements.current[0] = el!;
				}}
				index={0}
			>
				<div className={styles.socialGrid}>
					<div className={styles.socialBar}>
						<img className={styles.socialIcon} src={WebsiteIcon} />
						AusSpeedruns.com
					</div>
				</div>
			</Stagger>
			<Stagger
				ref={(el) => {
					staggerElements.current[1] = el!;
				}}
				index={2}
			>
				<div className={styles.socialGrid}>
					<div className={styles.socialBar}>
						<img className={styles.socialIcon} src={TwitchIcon} /> @AusSpeedruns
					</div>
					<div className={styles.socialBar}>
						<img className={styles.socialIcon} src={YouTubeIcon} /> @AusSpeedruns
					</div>
				</div>
			</Stagger>
			<Stagger
				ref={(el) => {
					staggerElements.current[2] = el!;
				}}
				index={4}
			>
				<div className={styles.socialBar}>
					<img className={styles.socialIcon} src={DiscordIcon} /> AusSpeedruns.com/Discord
				</div>
			</Stagger>
		</div>
	);
}

interface PrizeProps {
	children?: React.ReactNode;
	index: number;
	ref?: React.Ref<TickerItemHandles>;
}

function Stagger(props: PrizeProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(props.ref, () => ({
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

	return (
		<div className={styles.staggerContainer} ref={containerRef}>
			{props.children}
		</div>
	);
}
