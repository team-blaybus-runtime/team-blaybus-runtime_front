"use client";

import { Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Bounds } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  N8AO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import styled from "styled-components";
import LightingSetup from "@/component/study/LightingSetup";
import AssemblyViewer from "@/component/study/AssemblyViewer";
import { useRenderStore } from "@/store/useRenderStore";
import { useModelStore } from "@/store/useModelStore";
import { StudyComponent } from "@/apis/studyApi";

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

interface ThreeCanvasProps {
  components: StudyComponent[];
}

export default function ThreeCanvas({ components }: ThreeCanvasProps) {
  const { bloom, ao, lighting } = useRenderStore();
  const { isTransforming, explodeLevel, setExplodeLevel } = useModelStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newLevel = Math.max(0, Math.min(1, explodeLevel + delta));
        setExplodeLevel(newLevel);
      }
    },
    [explodeLevel, setExplodeLevel]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <CanvasContainer ref={containerRef}>
      <Canvas
        shadows
        camera={{ position: [3, 2, 3], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#2b2b2b"]} />

        <LightingSetup
          keyLightIntensity={lighting.keyLightIntensity}
          ambientIntensity={lighting.ambientIntensity}
        />

        <Suspense fallback={<LoadingFallback />}>
          {components.length > 0 && (
            <Bounds fit clip observe margin={1.5}>
              <AssemblyViewer components={components} />
            </Bounds>
          )}
          <Environment preset="city" background={false} />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={bloom.intensity}
            luminanceThreshold={bloom.threshold}
            luminanceSmoothing={bloom.smoothing}
            mipmapBlur
          />
          <N8AO
            aoRadius={ao.radius}
            intensity={ao.intensity}
            distanceFalloff={0.5}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>

        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={2.5}
          far={4}
        />

        <OrbitControls
          enabled={!isTransforming}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          enableDamping
        />

        <gridHelper
          args={[20, 20, "#27272a", "#1a1a1a"]}
          position={[0, -2, 0]}
        />
      </Canvas>
    </CanvasContainer>
  );
}

const CanvasContainer = styled.div`
  position: absolute;
  inset: 0;
`;
