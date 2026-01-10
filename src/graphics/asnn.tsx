import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import { format } from "date-fns";
import gsap from "gsap";

import ASNNBug from "./media/asnn.webm";
import { TickerOverlay } from "./elements/ticker";
import { FitText } from "./elements/fit-text";

const TestContainer = styled.div``;

const ASNNContainer = styled.div`
	height: 1080px;
	width: 1920px;
	max-height: 1080px;
	border-right: 5px solid black;
	border-bottom: 5px solid black;
`;

const Content = styled.div`
	width: 1920px;
	height: 1016px;
	position: relative;
`;

const LowerThird = styled.div`
	display: grid;
	grid-template-columns: 80% 20%;
	column-gap: 16px;
	row-gap: 16px;
	/* display: flex;
	flex-direction: column; */
	/* gap: 16px; */
	width: 1600px;
	margin: auto;
	position: relative;
	top: 775px;
	/* margin-top: 600px; */
	/* position: absolute;
	bottom: 500px; */
`;

const Headline = styled.div`
	height: 128px;
	line-height: 128px;
	font-family: var(--secondary-font);
	padding: 0 24px;
	background-color: var(--asm-orange);
	color: var(--text-light);
	font-size: 80px;
`;

const Ticker = styled.div`
	height: 64px;
	line-height: 64px;
	font-family: var(--main-font);
	background-color: white;
	color: var(--asm-orange);
	font-size: 38px;
	overflow: hidden;
`;

const MarqueeKeyframes = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(calc(-100% - var(--gap)));
	}
`;

const Marquee = styled.div`
	--gap: 58px;
	display: flex;
	overflow: hidden;
	gap: var(--gap);
`;

const MarqueeContent = styled.ul`
	flex-shrink: 0;
	display: flex;
	justify-content: space-around;
	min-width: 100%;
	gap: var(--gap);
	animation: ${MarqueeKeyframes} 30s linear infinite;
	margin: 0;
	margin-block: 0;
	margin-inline: 0;
	padding-inline: 0;
`;

const ChannelBug = styled.video`
	width: 100%;
	height: 128px;
	object-fit: contain;
`;

const TimeBug = styled.div`
	height: 64px;
	line-height: 64px;
	font-family: var(--main-font);
	background-color: white;
	color: var(--asm-orange);
	font-size: 38px;
	overflow: hidden;
	text-align: center;
`;

const Nameplate = styled.div`
	display: flex;
	flex-direction: column;

	position: absolute;
	top: 633px;
	left: 160px;

	overflow: hidden;

	font-family: var(--main-font);
`;

const Name = styled.span`
	background: var(--asm-blue);
	width: fit-content;
	padding: 0 16px;
	color: var(--text-light);

	overflow: hidden;
	white-space: nowrap;
	font-size: 52px;
	margin-bottom: 3px;
	font-weight: bold;
`;

const Subtitle = styled.span`
	background: var(--asm-blue);
	width: fit-content;
	padding: 0 16px;
	color: var(--text-light);

	overflow: hidden;
	white-space: nowrap;
	font-size: 38px;
`;

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
		<TestContainer>
			<ASNNContainer>
				<Content>
					<Nameplate ref={nameplateEl}>
						<Name ref={nameEl} />
						<Subtitle ref={subtitleEl} />
					</Nameplate>
					<LowerThird>
						<Headline>
							<FitText alignment="left" text={asnnHeadline ?? ""} style={{ maxWidth: "100%" }} />
						</Headline>
						<ChannelBug src={ASNNBug} autoPlay muted loop />
						<Ticker>
							<Marquee>
								<MarqueeContent
									style={{ animationDuration: `${tickerLength * TICKER_DURATION_SCALAR}s` }}
								>
									{tickerElements}
								</MarqueeContent>
								<MarqueeContent
									style={{ animationDuration: `${tickerLength * TICKER_DURATION_SCALAR}s` }}
								>
									{tickerElements}
								</MarqueeContent>
							</Marquee>
						</Ticker>
						<TimeBug>{currentTime}</TimeBug>
					</LowerThird>
				</Content>
				<TickerOverlay />
			</ASNNContainer>
			<div>
				<button onClick={() => changeBGColor("#000")}>Black</button>
				<button onClick={() => changeBGColor("#f00")}>Red</button>
				<button onClick={() => changeBGColor("#0f0")}>Green</button>
				<button onClick={() => changeBGColor("#00f")}>Blue</button>
				<button onClick={() => changeBGColor("rgba(0, 0, 0, 0)")}>Transparent</button>
			</div>
		</TestContainer>
	);
};

createRoot(document.getElementById("root")!).render(<ASNN />);
