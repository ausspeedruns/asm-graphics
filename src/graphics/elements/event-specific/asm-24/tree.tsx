import * as THREE from "three";
import { shaderMaterial, useGLTF, useTexture } from "@react-three/drei";

import TreeModel from "./assets/Tree.glb?url";
import Bark from "./assets/bark.png";
import Leaves from "./assets/leaves.png";
import { useRef } from "react";
import { ObjectMap, extend, useFrame } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

const LeavesMaterial = shaderMaterial(
	{
		time: 0,
		color: new THREE.Color(0xffffff),
	},
	`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

	varying vec2 vUv;
	varying vec3 vColor;
void main() {

	vUv = vec3( uv, 1 ).xy;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
	vColor = vec3( 1.0 );

}`,
	`
uniform vec3 diffuse;
uniform float opacity;
	varying vec2 vUv;

#ifndef FLAT_SHADED

	varying vec3 vNormal;

#endif

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
	varying vec3 vColor;

void main() {
	// vec4 textureColor = texture2D(map, fract(vUv)); // Directly use fract(vUv) for tiling
	// if (textureColor.a < alphaTest) discard;

	// vec4 finalColor = vec4(textureColor.rgb * vColor, textureColor.a); // Simplified color calculation

	// gl_FragColor = finalColor;

	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;

	vec3 outgoingLight = reflectedLight.indirectDiffuse;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}
	`,
);

extend({ LeavesMaterial });

type TreeProps = { doRaycast?: THREE.Object3D | null; color: THREE.Color } & JSX.IntrinsicElements["group"];

export const Tree = (props: TreeProps) => {
	const leavesRef = useRef<THREE.Mesh>(null);
	const { nodes } = useGLTF(TreeModel) as GLTF & ObjectMap;
	const barkTexture = useTexture(Bark) as THREE.Texture;
	const leavesTexture = useTexture(Leaves) as THREE.Texture;

	barkTexture.minFilter = THREE.NearestFilter;
	barkTexture.magFilter = THREE.NearestFilter;

	leavesTexture.minFilter = THREE.NearestFilter;
	leavesTexture.magFilter = THREE.NearestFilter;
	leavesTexture.colorSpace = THREE.SRGBColorSpace;

	useFrame((state) => {
		if (!leavesRef.current) return;

		(leavesRef.current.material as JSX.IntrinsicElements["leavesMaterial"]).time = state.clock.getElapsedTime();
	});

	return (
		<group dispose={null} {...props}>
			<mesh geometry={(nodes.Cylinder005 as THREE.Mesh).geometry}>
				<meshBasicMaterial map={barkTexture} color={props.color} />
			</mesh>
			<mesh geometry={(nodes.Cylinder005_1 as THREE.Mesh).geometry} ref={leavesRef}>
				{/* <leavesMaterial map={leavesTexture} side={THREE.DoubleSide} alphaTest={0.5} color={props.color} /> */}
				{/* <leavesMaterial color={new THREE.Color(0xffffff)}/> */}
				<meshBasicMaterial map={leavesTexture} side={THREE.DoubleSide} alphaTest={0.5} color={props.color} />
			</mesh>
		</group>
	);
};

useGLTF.preload(TreeModel);

declare global {
	namespace JSX {
		interface IntrinsicElements {
			leavesMaterial: THREE.MeshBasicMaterialParameters & {
				time?: number;
			};
		}
	}
}
