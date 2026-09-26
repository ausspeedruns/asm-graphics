import { useRef, useState } from "react";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import gsap from "gsap";
import clsx from "clsx";

import AusSpeedrunsLogo from "../media/AusSpeedruns-Icon.svg";
import IndigenousFlags from "../media/IndigenousFlags.png";
import styles from "./name-lowerthird.module.css";

interface Props {
	name: string;
	subtitle: string;
	className?: string;
	style?: React.CSSProperties;
}

export const NameLowerThird = (props: Props) => {
	const LogoRef = useRef(null);
	const TextRef = useRef(null);
	const [tl] = useState(gsap.timeline);

	useListenFor("lowerthird:show", () => {
		tl.clear();
		tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.to([LogoRef.current, TextRef.current], { width: "auto", duration: 1 });
		tl.play();
	});

	useListenFor("lowerthird:hide", () => {
		tl.clear();
		tl.to([LogoRef.current, TextRef.current], { width: 0, duration: 1 });
		tl.play();
	});

	return (
		<div className={clsx(styles.nameLowerThirdContainer, props.className)} style={props.style}>
			<div className={styles.logoContainer} ref={LogoRef}>
				<img className={styles.logo} src={AusSpeedrunsLogo} />
			</div>
			<div className={styles.textContainer} ref={TextRef}>
				<div className={styles.name}>{props.name}</div>
				<div className={styles.subtitle}>{props.subtitle}</div>
			</div>
		</div>
	);
};

interface AcknowledgementOfCountryProps {
	className?: string;
	style?: React.CSSProperties;
}

export const AcknowledgementOfCountry = (props: AcknowledgementOfCountryProps) => {
	const [acknowledgementOfCountryRep] = useReplicant("acknowledgementOfCountry");
	const LogoRef = useRef(null);
	const TextRef = useRef(null);
	const [tl] = useState(gsap.timeline);

	useListenFor("show-acknowledgementofcountry", () => {
		tl.clear();
		tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.addLabel("open");
		tl.to(LogoRef.current, { width: "auto", duration: 1 }, "open");
		tl.to(TextRef.current, { width: 1082, duration: 1 }, "open");
		tl.play();
	});

	useListenFor("hide-acknowledgementofcountry", () => {
		tl.clear();
		tl.to([LogoRef.current, TextRef.current], { width: 0, duration: 1 });
		// tl.set([LogoRef.current, TextRef.current], { width: 0 });
		tl.play();
	});

	return (
		<div className={clsx(styles.nameLowerThirdContainer, props.className)} style={props.style}>
			<div className={styles.logoContainer} ref={LogoRef}>
				<img className={styles.indigenousFlagsImage} src={IndigenousFlags} />
			</div>
			<div className={styles.textContainer} ref={TextRef}>
				<div className={styles.acknowledgementText}>{acknowledgementOfCountryRep}</div>
			</div>
		</div>
	);
};
