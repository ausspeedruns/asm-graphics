import { useEffect, useRef } from "react";
import gsap from "gsap";
import clsx from "clsx";

import TwitchLogo from "../media/icons/Twitch.svg?react";
import type { RunDataPlayer } from "@asm-graphics/types/RunData";

import { FitText } from "@asm-graphics/shared-browser/fit-text";
import styles from "./nameplate.module.css";

interface NameplateProps {
	player?: RunDataPlayer;
	nameplateLeft?: boolean;
	maxWidth?: number;
	icon?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
	speaking?: boolean;
	vertical?: boolean;
	speakingValue?: number;
}

// How many seconds it takes to fade between twitch and normal name
const NAME_LOOP_DURATION = 90;

export function Nameplate(props: NameplateProps) {
	const normalNameEl = useRef<HTMLDivElement>(null);
	const twitchNameEl = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!props.player) return;
		// Only loop if twitch name exists and if they are different, if the same then just display twitch
		if (props.player.social.twitch && props.player.name !== props.player.social.twitch) {
			const tl = gsap.timeline({
				repeat: -1,
				repeatDelay: NAME_LOOP_DURATION,
			});
			tl.set(normalNameEl.current, { opacity: 1 });
			tl.to(normalNameEl.current, { opacity: 0, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 1, duration: 1 });
			tl.to(twitchNameEl.current, { opacity: 0, duration: 1 }, `+=${NAME_LOOP_DURATION}`);
			tl.to(normalNameEl.current, { opacity: 1, duration: 1 });
		}
	}, [props.player?.name, props.player?.social.twitch]);

	const sameNameAndTwitch = props.player?.name === props.player?.social.twitch;

	const maxWidth = props.maxWidth ?? 999;
	// const maxWidth = props.vertical ? (props.maxWidth ?? 999) * 0.7 : props.maxWidth ?? 999;

	return (
		<div
			className={clsx(
				styles.nameplateContainer,
				props.vertical ? styles.vertical : props.nameplateLeft && styles.nameplateLeft,
				props.className,
			)}
			style={props.style}
		>
			{props.icon}
			<div className={clsx(styles.names, props.vertical && styles.verticalNames)}>
				<div className={clsx(styles.speakingGlow, props.speaking && styles.speaking)} />
				<div ref={normalNameEl} style={{ opacity: sameNameAndTwitch ? 0 : 1, zIndex: 2 }}>
					<FitText style={{ maxWidth: maxWidth }} text={props.player?.name ?? "AusSpeedruns"} />
				</div>
				<div className={styles.twitchDiv} ref={twitchNameEl} style={{ opacity: sameNameAndTwitch ? 1 : 0, zIndex: 2 }}>
					<TwitchLogo className={styles.twitchLogoImg} />

					<div>
						<FitText
							style={{ maxWidth: maxWidth - 45 }}
							text={props.player?.social.twitch ?? "AusSpeedruns"}
						/>
					</div>
				</div>
			</div>
			{props.player?.pronouns && (
				<div className={clsx(styles.pronounBox, props.vertical && styles.verticalPronounBox)}>
					<FitText
						style={{ maxWidth: props.vertical ? maxWidth : maxWidth * 0.45 }}
						text={props.player.pronouns}
					/>
				</div>
			)}
		</div>
	);
}
