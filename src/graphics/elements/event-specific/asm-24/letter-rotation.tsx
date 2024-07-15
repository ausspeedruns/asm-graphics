import { forwardRef, useContext } from "react";
import { ShaderMaterialProps, extend } from "@react-three/fiber";
import { Center, shaderMaterial } from "@react-three/drei";
import { Group } from "three";

import { notoSansBold, notoSansRegular, russoOne, seamless } from "./letter-spacing";
import { AvailableFonts, Letter } from "./letter";

const TextMaterial = shaderMaterial(
	{},
	// vertex shader
	/*glsl*/ `
	varying vec2 vUv;
	varying vec3 vNormal;

	void main() {
		vUv = uv;
		vNormal = normal;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
	`,
	// fragment shader
	/*glsl*/ `
	varying vec2 vUv;
	varying mediump vec3 vNormal;

	const vec3 colourFront = vec3(1., 1., 1.);
	const vec3 colourSide = vec3(0.5, 0.5, 0.5);
	const vec3 colourBottom = vec3(0.2, 0.2, 0.25);

	void main() {
		if (-vNormal.y > 0.5) {
			gl_FragColor.rgb = colourBottom;
		} else if (vNormal.x > 0.6) {
			gl_FragColor.rgb = colourSide;
		} else {
			gl_FragColor.rgb = colourFront;
		}

		gl_FragColor.a = 1.0;
	}
	`,
);

extend({ TextMaterial });

function getLetterSpacing(letter: string, font: AvailableFonts) {
	switch (font) {
		case "Seamless":
			return seamless(letter);
		case "Russo One":
			return russoOne(letter);
		case "Noto Sans Bold":
			return notoSansBold(letter);
		case "Noto Sans":
		default:
			return notoSansRegular(letter);
	}
}

function generateLine(text: string, font: AvailableFonts, doAnimation: boolean) {
	let letters = Array.from(text);
	let letterElements = [];

	let currentLetterSpacing = 0;

	for (let i = 0; i < letters.length; i++) {
		const letter = letters[i];

		const letterMesh = (
			<Letter
				key={letter + i}
				letter={letter}
				size={0.5}
				font={font}
				position={[currentLetterSpacing, 0, 0]}
				doAnimation={doAnimation}
			/>
		);

		currentLetterSpacing += getLetterSpacing(letter, font);

		letterElements.push(letterMesh);
	}

	return <Center>{letterElements}</Center>;
}

function unescapeNewLines(text: string) {
	return text.replace(/\\n/g, "\n");
}

function generateParagraph(text: string, font: AvailableFonts, doAnimation: boolean) {
	// console.log(text, text.split("\n"));
	return unescapeNewLines(text)
		.split("\n")
		.map((line) => generateLine(line.trim(), font, doAnimation));
}

type LetterProps = {
	text?: string;
	letterRotations?: {
		xRotation?: number;
		yRotation?: number;
	};
	fontSize?: number;
	font: AvailableFonts;
	dontUpdateCenter?: boolean;
	doAnimation?: boolean;
} & Omit<React.ComponentProps<typeof Center>, "ref">;

export const ASRText = forwardRef<Group, LetterProps>((props, ref) => {
	if (!props.text) return <></>;

	const letters = generateParagraph(props.text, props.font, props.doAnimation ?? true);

	// console.log(props.text, letters)

	return (
		<Center ref={ref} cacheKey={props.dontUpdateCenter ? "" : props.text} {...props}>
			{letters.map((line, i) => (
				<group key={i} position={[0, -i * 0.7, 0]}>
					{line}
				</group>
			))}
			{props.children}
		</Center>
	);
});

declare global {
	namespace JSX {
		interface IntrinsicElements {
			textMaterial: ShaderMaterialProps & {};
		}
	}
}
