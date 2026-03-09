import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import { Experience } from "./components/Experience";
import { GameUI } from "./components/GameUI";
import { OrientationLock } from "./components/OrientationLock";
import { StartScreen } from "./components/StartScreen";
import { TouchControls } from "./components/TouchControls";

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <OrientationLock>
        <StartScreen onStart={() => setGameStarted(true)} />
      </OrientationLock>
    );
  }

  return (
    <OrientationLock>
      <Loader />
      <GameUI />
      <TouchControls />
      <Canvas
        shadows
        camera={{ position: [0, 2, 0], fov: 75, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <SoftShadows size={42} />

        <PerformanceMonitor
          onDecline={(fps) => {
            setDowngradedPerformance(true);
          }}
        />
        <Suspense>
          <Physics>
            <Experience downgradedPerformance={downgradedPerformance} />
          </Physics>
        </Suspense>
        {!downgradedPerformance && (
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </OrientationLock>
  );
}

export default App;
