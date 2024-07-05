import * as THREE from "three";
import { shaderMaterial, useGLTF, useTexture } from "@react-three/drei";

import TreeModel from "./assets/Tree.glb?url";
import Bark from "./assets/bark.png";
import Leaves from "./assets/leaves.png";
import { useRef } from "react";
import { ShaderMaterialProps, extend, useFrame } from "@react-three/fiber";

const LeavesMaterial = shaderMaterial(
	{
		map: null,
		color: new THREE.Color(0xffffff),
		alphaTest: 0,
		time: 0,
	},
	`
    varying vec2 vUv;
    uniform float time; // Time uniform

	// https://www.shadertoy.com/view/XsX3zB
	/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
	vec3 random3(vec3 c) {
		float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
		vec3 r;
		r.z = fract(512.0*j);
		j *= .125;
		r.x = fract(512.0*j);
		j *= .125;
		r.y = fract(512.0*j);
		return r-0.5;
	}

	/* skew constants for 3d simplex functions */
	const float F3 =  0.3333333;
	const float G3 =  0.1666667;

	/* 3d simplex noise */
	float simplex3d(vec3 p) {
		/* 1. find current tetrahedron T and it's four vertices */
		/* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
		/* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/

		/* calculate s and x */
		vec3 s = floor(p + dot(p, vec3(F3)));
		vec3 x = p - s + dot(s, vec3(G3));

		/* calculate i1 and i2 */
		vec3 e = step(vec3(0.0), x - x.yzx);
		vec3 i1 = e*(1.0 - e.zxy);
		vec3 i2 = 1.0 - e.zxy*(1.0 - e);

		/* x1, x2, x3 */
		vec3 x1 = x - i1 + G3;
		vec3 x2 = x - i2 + 2.0*G3;
		vec3 x3 = x - 1.0 + 3.0*G3;

		/* 2. find four surflets and store them in d */
		vec4 w, d;

		/* calculate surflet weights */
		w.x = dot(x, x);
		w.y = dot(x1, x1);
		w.z = dot(x2, x2);
		w.w = dot(x3, x3);

		/* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
		w = max(0.6 - w, 0.0);

		/* calculate surflet components */
		d.x = dot(random3(s), x);
		d.y = dot(random3(s + i1), x1);
		d.z = dot(random3(s + i2), x2);
		d.w = dot(random3(s + 1.0), x3);

		/* multiply d by w^4 */
		w *= w;
		w *= w;
		d *= w;

		/* 3. return the sum of the four surflets */
		return dot(d, vec4(52.0));
	}

	float map(float value, float min1, float max1, float min2, float max2) {
		return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
	}

	const float xScale = 0.08; // Scale factor for X axis
	const float yScale = 0.04; // Scale factor for Y axis
	const float speed = 0.01; // Speed factor

	const vec2 ps1Resolution = vec2(192, 144);

    void main() {
		vUv = uv;

		// Transform the vertex position to world space using the modelMatrix
		vec4 worldPosition = modelMatrix * vec4(position, 1.0);

		// Calculate noise-based wind effect
		vec3 noiseInput = worldPosition.xyz + (time * speed); // Scale position for noise input
		float timeScaled = time * 0.01; // Scale time for a more gradual change
		float xNoiseValue = simplex3d(noiseInput) * xScale;
		float yNoiseValue = simplex3d(noiseInput + 2024.) * yScale;

		// Remap values from 0 - 1 to the respective scales
		// xNoiseValue = map(xNoiseValue, 0., 1., -xScale, xScale);
		// yNoiseValue = map(yNoiseValue, 0., 1., -yScale, yScale);
		// xNoiseValue = map(xNoiseValue, 0., 1., -0.5, 0.5);

		worldPosition.xyz += vec3(xNoiseValue, yNoiseValue, 0.);

		vec4 mvPosition = viewMatrix * worldPosition;

		// Apply the view and projection matrices
		// gl_Position = projectionMatrix * viewMatrix * worldPosition;

		gl_Position = projectionMatrix * mvPosition;
		gl_Position.xyz /= gl_Position.w;
		gl_Position.xy = floor(ps1Resolution * gl_Position.xy) / ps1Resolution;
		gl_Position.xyz *= gl_Position.w;
    }
    `,
	`
    uniform sampler2D map;
    uniform vec3 color;
    uniform float alphaTest;

    varying vec2 vUv;

    void main() {
		vec4 textureColor = texture2D(map, fract(vUv)); // Directly use fract(vUv) for tiling
		if (textureColor.a < alphaTest) discard;

		vec4 finalColor = vec4(textureColor.rgb * color, textureColor.a); // Simplified color calculation

		gl_FragColor = finalColor;
    }
	`,
);

extend({ LeavesMaterial });

type TreeProps = { doRaycast?: THREE.Object3D | null; color: THREE.Color } & JSX.IntrinsicElements["group"];

export const Tree = (props: TreeProps) => {
	const leavesRef = useRef<THREE.Mesh>(null);
	const { nodes } = useGLTF(TreeModel);
	const barkTexture = useTexture(Bark) as THREE.Texture;
	const leavesTexture = useTexture(Leaves) as THREE.Texture;

	barkTexture.minFilter = THREE.NearestFilter;
	barkTexture.magFilter = THREE.NearestFilter;

	leavesTexture.minFilter = THREE.NearestFilter;
	leavesTexture.magFilter = THREE.NearestFilter;

	useFrame((state) => {
		if (!leavesRef.current) return;

		(leavesRef.current.material as JSX.IntrinsicElements["leavesMaterial"]).time = state.clock.getElapsedTime();
	});

	return (
		<group dispose={null} {...props}>
			<mesh geometry={nodes.Cylinder005.geometry}>
				<meshBasicMaterial map={barkTexture} color={props.color} />
			</mesh>
			<mesh geometry={nodes.Cylinder005_1.geometry} ref={leavesRef}>
				<leavesMaterial map={leavesTexture} side={THREE.DoubleSide} alphaTest={0.5} color={props.color} />
			</mesh>
		</group>
	);
};

useGLTF.preload(TreeModel);

declare global {
	namespace JSX {
		interface IntrinsicElements {
			leavesMaterial: ShaderMaterialProps & {
				map: THREE.Texture;
				color: THREE.Color;
				time?: number;
			};
		}
	}
}
