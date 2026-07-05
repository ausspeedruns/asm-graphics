import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import styles from "./background-music.module.css";

import MusicIconImg from "../overlays/asm26/Music.svg?react";

interface BackgroundMusicProps {
	volume?: number;
}

export function BackgroundMusic(props: BackgroundMusicProps) {
	const [currentSong, setCurrentSong] = useState("");
	const [showMarquee, setShowMarquee] = useState(false);
	const songEl = useRef<HTMLSpanElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		async function getCurrentSong() {
			const song = await fetch("https://rainwave.cc/api4/info_all?sid=2", { method: "GET" });
			const songJson = await song.json();
			setCurrentSong(
				`${songJson.all_stations_info[2].title} – ${songJson.all_stations_info[2].artists} – ${songJson.all_stations_info[2].album}`,
			);
		}

		void getCurrentSong();

		const songInterval = setInterval(() => {
			void getCurrentSong();
		}, 3000);

		return () => {
			clearInterval(songInterval);
		};
	}, []);

	useEffect(() => {
		if (!songEl.current) return;
		setShowMarquee(songEl.current.offsetWidth < songEl.current.scrollWidth);
	}, [currentSong, songEl]);

	useEffect(() => {
		if (!audioRef.current) return;
		audioRef.current.volume = props.volume ?? 1;
	}, [props.volume]);

	return (
		<div className={styles.music}>
			<MusicIconImg className={styles.musicIcon} />
			<audio id="intermission-music" autoPlay preload="auto" ref={audioRef}>
				{/* <source type="audio/mp3" src="http://allrelays.rainwave.cc/ocremix.mp3?46016:hfmhf79FuJ" /> */}
			</audio>
			<div className={styles.songName}>
				<div className={clsx(styles.marqueeContainer, !showMarquee && styles.hide)}>
					<span className={styles.marquee} style={{ animationDuration: `${currentSong.length * 0.35}s` }}>
						{currentSong}
					</span>
				</div>
				<span ref={songEl} className={clsx(styles.static, showMarquee && styles.hide)}>
					{currentSong}
				</span>
			</div>
		</div>
	);
}
