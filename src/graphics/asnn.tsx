import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { format } from "date-fns";
import gsap from "gsap";

import ASNNBug from "./media/asnn.webm";
import { FitText } from "@asm-graphics/shared-browser/fit-text";
import styles from "./asnn.module.css";

const TICKER_DURATION_SCALAR = 0.3;

export const ASNN = () => {
	const [currentTime, setCurrentTime] = useState("");
	const nameEl = useRef<HTMLDivElement>(null);
	const subtitleEl = useRef<HTMLDivElement>(null);
	const nameplateEl = useRef<HTMLDivElement>(null);
	const [asnnHeadline] = useReplicant("asnn:headline");
	const [asnnTicker] = useReplicant("asnn:ticker");

	// const tickerTexts = [
	// 	'AUSSPEEDRUNS INTERVIEWS GONE MISSING, SEARCH PARTY NON-EXISTENT',
	// 	'ROCKFORD PIES ARE GOATED NGL',
	// 	'HOW WILL FF8 RUNNERS ALL PLAY ON A SINGLE CONTROLLER? MORE AT 1:10 AM',
	// 	'4TH HEADSET TO NeVER oh hey lowercase, cool, my throat was getting sore',
	// ];
	const tickerLength = (asnnTicker ?? []).join().length;
	const tickerElements = (asnnTicker ?? []).map((text) => <li key={text}>{text}</li>);

	function changeBGColor(col: string) {
		document.body.style.background = col;
	}

	useEffect(() => {
		setCurrentTime(format(new Date(), "h:mm a"));

		const interval = setInterval(() => {
			setCurrentTime(format(new Date(), "h:mm a"));
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	useListenFor("asnn:showName", (data) => {
		if (!nameEl.current || !subtitleEl.current || !nameplateEl.current) return;

		nameEl.current.innerHTML = data.name;
		subtitleEl.current.innerHTML = data.subtitle;

		gsap.from([nameplateEl.current, nameEl.current, subtitleEl.current], { width: 0, duration: 1 });
	});

	useListenFor("asnn:hideName", () => {
		if (!nameEl.current || !subtitleEl.current || !nameplateEl.current) return;
		const tl = gsap.timeline();
		tl.to([nameplateEl.current, nameEl.current, subtitleEl.current], { width: 0, duration: 1 });
		tl.set([nameplateEl.current, nameEl.current, subtitleEl.current], { width: "" });
		tl.call(() => {
			nameEl.current!.innerHTML = "";
			subtitleEl.current!.innerHTML = "";
		});
	});

	return (
		<div>
			<div className={styles.asnnContainer}>
				<div className={styles.content}>
					<div className={styles.nameplate} ref={nameplateEl}>
						<span className={styles.name} ref={nameEl} />
						<span className={styles.subtitle} ref={subtitleEl} />
					</div>
					<div className={styles.lowerThird}>
						<div className={styles.headline}>
							<FitText alignment="left" text={asnnHeadline ?? ""} style={{ maxWidth: "100%" }} />
						</div>
						<video className={styles.channelBug} src={ASNNBug} autoPlay muted loop />
						<div className={styles.ticker}>
							<div className={styles.marquee}>
								<ul
									className={styles.marqueeContent}
									style={{ animationDuration: `${tickerLength * TICKER_DURATION_SCALAR}s` }}
								>
									{tickerElements}
								</ul>
								<ul
									className={styles.marqueeContent}
									style={{ animationDuration: `${tickerLength * TICKER_DURATION_SCALAR}s` }}
								>
									{tickerElements}
								</ul>
							</div>
						</div>
						<div className={styles.timeBug}>{currentTime}</div>
					</div>
				</div>
			</div>
			<div>
				<button onClick={() => changeBGColor("#000")}>Black</button>
				<button onClick={() => changeBGColor("#f00")}>Red</button>
				<button onClick={() => changeBGColor("#0f0")}>Green</button>
				<button onClick={() => changeBGColor("#00f")}>Blue</button>
				<button onClick={() => changeBGColor("rgba(0, 0, 0, 0)")}>Transparent</button>
			</div>
		</div>
	);
};

createRoot(document.getElementById("root")!).render(<ASNN />);
