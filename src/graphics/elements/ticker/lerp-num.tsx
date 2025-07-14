import { useState, useEffect, useRef, useImperativeHandle } from "react";
import gsap, { Power2 } from "gsap";

interface LerpNumProps {
	value: number;
	ref?: React.Ref<LerpNumRef>;
}

export interface LerpNumRef {
	getDisplayValue: () => number;
}

// This is very dumb, I have no idea why I did this
export function LerpNum (props: LerpNumProps) {
	const [displayValue, setDisplayValue] = useState(0);
	const [lerp, setLerp] = useState(false);
	const dummyEl = useRef<HTMLDivElement>(null);

	useImperativeHandle(props.ref, () => ({
		getDisplayValue: () => displayValue,
	}));

	useEffect(() => {
		// setDisplayValue(props.value);
		// if (dummyEl.current) dummyEl.current.style.transform = `translate(${props.value / 100}px, 0px)`;

		const timer = setTimeout(() => {
			setLerp(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	// Original ??/07/2020
	// Basically I had no idea how to lerp a state
	// So I lerped an element's position and took that value to set the display value
	// The division by 100 is so that I don't run into a bug or performance issues that may or may not exist at x: 100,000
	// Literally I have no idea if anything happens at x: 100,000 but I cant be bothered finding out

	// Update 08/07/2022
	// I still have no idea how to lerp a state
	useEffect(() => {
		if (lerp) {
			const timeInterval = Math.min((props.value - displayValue) * 0.03, 3);
			gsap.to(dummyEl.current, {
				ease: Power2.easeOut,
				duration: timeInterval,
				x: props.value / 100,
				onUpdate: () => {
					const dummyElPos = gsap.getProperty(dummyEl.current, "x") ?? 0;
					setDisplayValue(parseFloat(dummyElPos.toString()) * 100);
				},
			});
		} else {
			setDisplayValue(props.value);
			if (dummyEl.current) dummyEl.current.style.transform = `translate(${props.value / 100}px, 0px)`;
		}

		// Legit this makes the animation really smooth, no idea how it works but it does
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.value]);

	return (
		<>
			{Math.floor(displayValue).toLocaleString()}
			<div ref={dummyEl} />
		</>
	);
};
