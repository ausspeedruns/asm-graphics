import { Fragment, useRef } from "react";
import gsap from "gsap";
import { useListenFor, useReplicant } from "@nodecg/react-hooks";
import styles from "./credits.module.css";

const PIXELS_PER_SECOND = 100;
const PANEL_WIDTH = 500;
const PANEL_TRANSITION_DURATION = 2;
const FINISH_HOLD_DURATION = 2;

export function Credits() {
	const [creditsRep] = useReplicant("credits");
	const creditsBGRef = useRef<HTMLDivElement>(null);
	const allCreditsRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useListenFor("credits:start", () => {
		const container = creditsBGRef.current;
		const panel = container?.firstElementChild;
		const credits = allCreditsRef.current;

		if (!container || !panel || !credits) return;

		timelineRef.current?.kill();

		const viewportHeight = container.clientHeight;
		const creditsHeight = credits.scrollHeight;
		const scrollDistance = viewportHeight + creditsHeight;
		const scrollDuration = scrollDistance / PIXELS_PER_SECOND;

		gsap.set(panel, { width: 0 });
		gsap.set(credits, { y: viewportHeight });

		const tl = gsap.timeline();
		timelineRef.current = tl;
		tl.to(panel, { width: PANEL_WIDTH, duration: PANEL_TRANSITION_DURATION });
		tl.to(credits, { y: -creditsHeight, duration: scrollDuration, ease: "none" });
		tl.to(panel, { width: 0, duration: PANEL_TRANSITION_DURATION }, `+=${FINISH_HOLD_DURATION}`);
	});

	if (!creditsRep) return null;

	return (
		<div className={styles.creditsContainer} ref={creditsBGRef}>
			<div className={styles.creditsPanel}>
				<div className={styles.allCredits} ref={allCreditsRef}>
					<div className={styles.eventImg}>
						<img style={{ width: "90%", height: "auto" }} src={creditsRep.logo} />
					</div>
					<div className={styles.title}>{creditsRep.eventName}</div>
					{creditsRep.sections.map((section, index) => (
						<Fragment key={index}>
							<div className={styles.title}>{section.title}</div>
							<div className={styles.nameContainer}>
								{section.names.map((name, nameIndex) => (
									<div className={styles.nameWithRoles} key={nameIndex}>
										{name.role}
										<span>{name.name}</span>
									</div>
								))}
							</div>
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
}
