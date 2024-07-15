import * as THREE from "three";
import { ShaderMaterialProps, extend, useThree } from "@react-three/fiber";
import { Plane, useTexture, shaderMaterial } from "@react-three/drei";

import skyBayerImg from "./assets/Bayer256.png";
import skyBayer128Img from "./assets/Bayer128.png";
import stars from "./assets/stars.png";
import { lightValue, sunriseEnd, sunriseStart, sunsetEnd, sunsetStart } from "./time-utils";

const SkyMaterial = shaderMaterial(
	{
		uTexture: null,
		uColorStops: [0.0, 0.33, 0.66, 1.0],
		uColors: [
			new THREE.Color(0x000000),
			new THREE.Color(0x333333),
			new THREE.Color(0x666666),
			new THREE.Color(0xffffff),
		],
		uTileX: 1,
	},
	`
	varying vec2 vUv;
	void main() {
	  vUv = uv;
	  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
	`,
	`
	uniform sampler2D uTexture;
	uniform float uColorStops[4];
	uniform vec3 uColors[4];
	uniform float uTileX;

	varying vec2 vUv;

	void main() {
	  vec2 tiledUV = vec2(vUv.x * uTileX, vUv.y); // Tile the texture on the x direction
	  vec4 textureColor = texture2D(uTexture, fract(tiledUV));
	  float t = textureColor.r;

	  vec3 color = mix(uColors[0], uColors[1], smoothstep(uColorStops[0], uColorStops[1], t));
	  color = mix(color, uColors[2], smoothstep(uColorStops[1], uColorStops[2], t));
	  color = mix(color, uColors[3], smoothstep(uColorStops[2], uColorStops[3], t));

	  gl_FragColor = vec4(color, 1.0);
	}
	`,
);

extend({ SkyMaterial });

type SkyColour = {
	time: number;
	colours: LocalStops[];
};

type LocalStops = {
	stop: number;
	colour: THREE.Color;
};

function localStopsToTuple(stops: LocalStops[]): [number[], THREE.Color[]] {
	const stopValues = stops.map((stop) => stop.stop);
	const colorValues = stops.map((stop) => stop.colour.clone());
	return [stopValues, colorValues];
}

const dayTimeColours = [
	{ stop: 0, colour: new THREE.Color("#92fbff").convertLinearToSRGB() }, // #92fbff linear(#c4fdff)
	{ stop: 0.727, colour: new THREE.Color("#164ec9").convertLinearToSRGB() }, // #164ec9 linear(#4d98e1)
	{ stop: 1, colour: new THREE.Color("#164ec9").convertLinearToSRGB() }, // #164ec9
	{ stop: 1, colour: new THREE.Color("#164ec9").convertLinearToSRGB() },
];
const nightTimeColours = [
	{ stop: 0, colour: new THREE.Color("#3a5e85").convertLinearToSRGB() }, // #3a5e85
	{ stop: 0.436, colour: new THREE.Color("#030c38").convertLinearToSRGB() }, // #030c38
	{ stop: 0.732, colour: new THREE.Color("#010417").convertLinearToSRGB() }, // #010417
	{ stop: 1, colour: new THREE.Color("#000000").convertLinearToSRGB() }, // #000000
];

const sunsetColours = [
	{ stop: 0, colour: new THREE.Color("#cc7722").convertLinearToSRGB() }, // #cc7722
	{ stop: 0.418, colour: new THREE.Color("#a63a3a").convertLinearToSRGB() }, // #a63a3a
	{ stop: 1, colour: new THREE.Color("#3a1a3a").convertLinearToSRGB() }, // #3a1a3a
	{ stop: 1, colour: new THREE.Color("#3a1a3a").convertLinearToSRGB() },
];

const sunriseColours = [
	{ stop: 0, colour: new THREE.Color("#fcc189").convertLinearToSRGB() }, // #fcc189
	{ stop: 0.195, colour: new THREE.Color("#fc7a57").convertLinearToSRGB() }, // #fc7a57
	{ stop: 1, colour: new THREE.Color("#3d5fac").convertLinearToSRGB() }, // #3d5fac
	{ stop: 1, colour: new THREE.Color("#3d5fac").convertLinearToSRGB() },
];

const SkyColours: SkyColour[] = [
	{ time: 0.0, colours: dayTimeColours },
	{ time: sunsetStart, colours: dayTimeColours },
	{ time: (sunsetStart + sunsetEnd) / 2, colours: sunsetColours },
	{ time: sunsetEnd, colours: nightTimeColours },
	{ time: sunriseStart, colours: nightTimeColours },
	{ time: (sunriseStart + sunriseEnd) / 2, colours: sunriseColours },
	{ time: sunriseEnd, colours: dayTimeColours },
];

const sortedColours = SkyColours.sort((a, b) => a.time - b.time);

function skyColourLerp(time: number): [stops: number[], colours: THREE.Color[]] {
	let lower;
	for (let i = sortedColours.length - 1; i >= 0; i--) {
		const c = sortedColours[i];
		if (c.time <= time) {
			lower = c;
			break;
		}
	}
	const upper = sortedColours.find((c) => c.time > time);

	if (!lower || !upper) return localStopsToTuple(dayTimeColours);

	const t = (time - lower.time) / (upper.time - lower.time);

	const lowerColours = localStopsToTuple(lower.colours);
	const upperColours = localStopsToTuple(upper.colours);

	const resultStops = lowerColours[0].map((stop, i) => stop + (upperColours[0][i] - stop) * t);
	const resultColours = lowerColours[1].map((c, i) => c.clone().lerp(upperColours[1][i], t));

	return [resultStops, resultColours];
}

type SkyProps = {
	yOffset?: number;
	xExtraWidth?: number;
	time: number;
	bayer128?: boolean;

	testSkyColours?: { stop: number; colour: string }[];
} & JSX.IntrinsicElements["group"];

export const Sky = (props: SkyProps) => {
	const { viewport } = useThree();
	const skyTexture = useTexture(props.bayer128 ? skyBayer128Img : skyBayerImg) as THREE.Texture;
	const starsTexture = useTexture(stars) as THREE.Texture;

	skyTexture.minFilter = THREE.NearestFilter;
	skyTexture.magFilter = THREE.NearestFilter;

	const width = viewport.width + (props.xExtraWidth ?? 0);
	starsTexture.minFilter = THREE.NearestFilter;
	starsTexture.magFilter = THREE.NearestFilter;
	starsTexture.wrapS = THREE.RepeatWrapping;
	starsTexture.repeat.set(width / viewport.height, 1);
	starsTexture.offset.x = 0.67;

	const [colourStops, colours] = skyColourLerp(props.time);

	return (
		<group {...props}>
			<Plane args={[width, viewport.height]}>
				<skyMaterial
					key={SkyMaterial.key}
					uTexture={skyTexture}
					uColorStops={colourStops}
					uColors={colours}
					// uColorStops={sunsetColours.map((c) => c.stop)}
					// uColors={sunsetColours.map((c) => c.colour)}
					// uColorStops={(props.testSkyColours ?? []).map((c) => c.stop)}
					// uColors={(props.testSkyColours ?? []).map((c) => new THREE.Color(c.colour).convertLinearToSRGB())}
					uTileX={width / viewport.height}
				/>
			</Plane>
			<Plane args={[width, viewport.height]} position={[-0.2, 0, 0.01]}>
				<meshBasicMaterial map={starsTexture} alphaTest={Math.max(lightValue(props.time), 0.01)} fog={false} />
			</Plane>
		</group>
	);
};

declare global {
	namespace JSX {
		interface IntrinsicElements {
			skyMaterial: ShaderMaterialProps & {
				uTexture: THREE.Texture;
				uColorStops: number[];
				uColors: THREE.Color[];
				uTileX: number;
			};
		}
	}
}
