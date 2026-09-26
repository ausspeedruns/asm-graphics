import { useEffect, useImperativeHandle, useRef, useState } from "react";

import type { TickerItemHandles } from "../ticker";
import styles from "./cta.module.css";

interface CTAProps {
	currentTotal?: number;
	ref?: React.Ref<TickerItemHandles>;
}

function getFact(total?: number) {
	if (!total) return "Let's break our record!";
	let maxFacts = -1;
	if (total >= 75) maxFacts++;
	// if (total >= 150) maxFacts++;
	if (total >= 1000) maxFacts++;
	// if (total >= 10000) maxFacts++;

	const random = Math.round(Math.random() * maxFacts);

	if (maxFacts === -1) return "Let's break our record!";

	return [
		// `We have funded <b>${~~(total / 75)}</b> hours of research!`,
		// `We have funded <b>${~~(total / 150)}</b> microscopy imaging sessions!`,
		// `We have funded <b>${~~(total / 1000)}</b> small scale drug screening studies!`,
		// `We have funded <b>${~~(total / 10000)}</b> genomic analysis of cancer cells!`,
	][random];
}

export function TickerCTA(props: CTAProps) {
	const containerRef = useRef(null);
	const donateRef = useRef(null);
	const incentiveRef = useRef(null);
	// const factRef = useRef(null);
	// const [fact, setFact] = useState("");

	// useEffect(() => {
	// 	setFact(getFact(props.currentTotal));
	// }, [props.currentTotal]);

	useImperativeHandle(props.ref, () => ({
		animation: (tl) => {
			// Start
			// tl.call(() => setFact(getFact(props.currentTotal)));
			// tl.set(containerRef.current, { y: -64 });
			tl.set(incentiveRef.current, { xPercent: 100 });
			tl.fromTo(containerRef.current, { y: -64 }, { y: 0, duration: 1 }, "+=1");

			tl.fromTo(donateRef.current, { xPercent: 0 }, { xPercent: -100, duration: 2 }, "+=5");
			tl.to(incentiveRef.current, { xPercent: 0, duration: 2 }, "-=2");
			// tl.to(incentiveRef.current, { xPercent: -200, duration: 2 }, "+=5");
			// tl.to(factRef.current, { xPercent: -100, duration: 2 }, "-=2");

			// End
			tl.to(containerRef.current, { y: 96, duration: 1 }, "+=5");
			// tl.set(containerRef.current, { y: -64, duration: 1 });
			// tl.set(donateRef.current, { xPercent: 0 });
			// tl.set(incentiveRef.current, { xPercent: 100 });
			// tl.set(factRef.current, { xPercent: 100 });

			return tl;
		},
	}));

	return (
		<div className={styles.tickerCtaContainer} ref={containerRef}>
			<div className={styles.ctaLine} ref={donateRef} style={{ fontSize: 37 }}>
				<span>Donate at&nbsp;</span>
				<span className={styles.emphasisFont}>ausspeedruns.com</span>
			</div>
			<div className={styles.ctaLine} ref={incentiveRef}>
				<span>Check out incentives at&nbsp;</span>
				<span className={styles.emphasisFont}>ausspeedruns.com/incentives</span>
			</div>
			{/* <CTALine ref={factRef} style={{ transform: "translate(100%, 0)" }}>
				<span dangerouslySetInnerHTML={{ __html: fact }}></span>
			</CTALine> */}
		</div>
	);
}
