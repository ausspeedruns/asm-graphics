import { useEffect, useState } from "react";
import { useTimeStyleContext } from "../use-time-style-context";
import styles from "./asm26-night-mode.module.css";
import { Colour } from "../../colour";
import { calculateTimeBasedColour } from "../time-style-context";
import Particles from "@tsparticles/react";
import { MoveDirection, type ISourceOptions } from "@tsparticles/engine";

const dayColour = new Colour("#00052800");
const nightColour = new Colour("#00052882");

const fireParticles: ISourceOptions = {
	fpsLimit: 30,
	fullScreen: {
		enable: false,
	},
	number: {
		value: 0,
		limit: {
			value: 300,
		},
	},
	background: {
		color: {
			value: "",
			// value: "#000",
		},
	},
	particles: {
		paint: {
			color: {
				value: "#ff9100",
			},
			fill: {
				enable: true,
				opacity: 1,
			},
		},
		move: {
			direction: "top",
			enable: true,
			random: true,
			straight: false,
			outModes: {
				bottom: "out",
				top: "out",
				default: "bounce",
			},
			speed: {
				min: 0.3,
				max: 0.6,
			},
		},
		opacity: {
			value: {
				min: 0.1,
				max: 0.2,
			},
		},
		size: {
			value: {
				min: 0,
				max: 150,
			},
			animation: {
				enable: true,
				speed: 7,
				startValue: "max",
				destroy: "min",
				// sync: true,
			},
		},
	},
	emitters: {
		direction: "top",
		position: {
			x: 50,
			// y: 100,
			y: 200,
		},
		size: {
			width: 80,
			height: 0,
		},
		rate: {
			quantity: 10,
			delay: 10,
		},
	},
	style: {
		filter: "blur(50px)",
	},
};

interface ASM26FireProps {
	className?: string;
	style?: React.CSSProperties;
	particlesId: string;
}

export function ASM26NightMode(props: ASM26FireProps) {
	const { normalizedTime, daylightData } = useTimeStyleContext();
	const [backgroundColour, setBackgroundColour] = useState<string>("transparent");

	useEffect(() => {
		const baseColour = calculateTimeBasedColour(normalizedTime, daylightData, {
			day: dayColour,
			night: nightColour,
		});

		if (!baseColour) return;
		setBackgroundColour(baseColour);
	}, [normalizedTime, daylightData]);

	return (
		<div
			className={`${styles.container} ${props.className ?? ""}`}
			style={
				{
					...props.style,
					backgroundColor: backgroundColour,
				} as React.CSSProperties
			}
		>
			<Particles id={props.particlesId} options={fireParticles} />
		</div>
	);
}
