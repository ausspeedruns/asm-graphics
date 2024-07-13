import { createRoot } from "react-dom/client";
import { SceneHill } from "./elements/event-specific/asm-24/scene-hill";
import { useNormalisedTime } from "../hooks/useCurrentTime";
import { ASRText } from "./elements/event-specific/asm-24/letter-rotation";
import { Canvas } from "@react-three/fiber";
import { Timer3D } from "./elements/event-specific/asm-24/timer-3d";
import { Timer } from "@asm-graphics/types/Timer";
import { useReplicant } from "@nodecg/react-hooks";
import { RunDataActiveRun } from "@asm-graphics/types/RunData";
import { OrthographicCamera } from "@react-three/drei";
import { Vector3 } from "three";

const TechSetup: React.FC = () => {
	const normalisedTime = useNormalisedTime();
	const [timerRep] = useReplicant<Timer>("timer", { bundle: "nodecg-speedcontrol" });
	const [runDataActiveRep] = useReplicant<RunDataActiveRun>("runDataActiveRun", { bundle: "nodecg-speedcontrol" });

	return (
		<>
			<div style={{ position: "absolute", height: "100%", width: "100%" }}>
				<SceneHill
					seed={1}
					trees={50}
					time={normalisedTime}
					contentStyle="tech-swapover"
					hillSettings={{ hillScale: new Vector3(5, 1, 1) }}
				/>
			</div>
			<div style={{ position: "absolute", height: "100%", width: "100%" }}>
				{/* <Canvas flat camera={{position: [0, 0, 50], isOrthographicCamera: true, near: 0.1, far: 100, zoom: 275}}> */}
				<Canvas flat>
					<OrthographicCamera makeDefault position={[0, 0, 8]} zoom={200} />
					<ASRText text="Preparing" font="Noto Sans Bold" position={[0, 0, 0]} scale={0.7} />
					<ASRText
						position={[0, -0.6, 0]}
						text={runDataActiveRep?.customData.gameDisplay ?? runDataActiveRep?.game ?? "???"}
						font="Russo One"
					/>
					<Timer3D timer={timerRep} position={[0, 1.5, 0]} scale={2} />
				</Canvas>
			</div>
		</>
	);
};

createRoot(document.getElementById("root")!).render(<TechSetup />);
