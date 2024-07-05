import * as THREE from "three";
import { Plane, ShapeProps, useTexture } from "@react-three/drei";

import CityTexture from "./assets/adelaide.png";
import CityLights from "./assets/adelaide_lights_threshold.png";
import { lightValue } from "./time-utils";
import { timeOfDayTint } from "./colours";

type CityProps = {
	time?: number;
} & ShapeProps<typeof THREE.PlaneGeometry>;

export const City = (props: CityProps) => {
	const cityTexture = useTexture(CityTexture) as THREE.Texture;
	const lightsTexture = useTexture(CityLights) as THREE.Texture;

	cityTexture.minFilter = THREE.NearestFilter;
	cityTexture.magFilter = THREE.NearestFilter;
	cityTexture.wrapT = THREE.ClampToEdgeWrapping;
	cityTexture.repeat.set(1, cityTexture.image.width / cityTexture.image.height);

	lightsTexture.minFilter = THREE.NearestFilter;
	lightsTexture.magFilter = THREE.NearestFilter;
	lightsTexture.wrapT = THREE.ClampToEdgeWrapping;
	lightsTexture.repeat.set(1, lightsTexture.image.width / lightsTexture.image.height);

	const cityColour = timeOfDayTint(props.time);

	return (
		<group>
			<Plane {...props}>
				<meshBasicMaterial map={cityTexture} alphaTest={0.5} color={cityColour} />
			</Plane>
			<group position={props.position} scale={props.scale}>
				<Plane rotation={[180 * (Math.PI / 180), 180 * (Math.PI / 180), 0]} position={[0, -1, 0]}>
					<meshBasicMaterial map={cityTexture} alphaTest={0.5} color={cityColour} />
				</Plane>
			</group>
			<Plane {...props}>
				<meshBasicMaterial
					map={lightsTexture}
					alphaTest={Math.max(lightValue(props.time ?? 0), 0.01)}
					color={new THREE.Color(0xf6d09a)}
					fog={false}
				/>
			</Plane>
		</group>
	);
};
