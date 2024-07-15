import { createRoot } from "react-dom/client";
import { SceneHill } from "./elements/event-specific/asm-24/scene-hill";
import { useNormalisedTime } from "../hooks/useCurrentTime";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Vector3 } from "three";

const ASNNBackground: React.FC = () => {
	const normalisedTime = useNormalisedTime();

	return (
		<>
			<div style={{ position: "absolute", height: "100%", width: "100%" }}>
				<SceneHill
					seed={1}
					trees={150}
					time={normalisedTime + 0.38}
					contentStyle="tech-swapover"
					hillSettings={{ hillScale: new Vector3(5, 1, 1) }}
				/>
			</div>
			<div style={{ position: "absolute", height: "100%", width: "100%" }}>
				<Canvas flat>
					<OrthographicCamera makeDefault position={[0, 0, 8]} zoom={200} />
				</Canvas>
			</div>
		</>
	);
};

createRoot(document.getElementById("root")!).render(<ASNNBackground />);
