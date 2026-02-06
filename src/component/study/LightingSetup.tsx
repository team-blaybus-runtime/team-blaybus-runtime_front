"use client";

import { useRef } from "react";
import { DirectionalLight, SpotLight } from "three";

interface LightingSetupProps {
  keyLightIntensity?: number;
  ambientIntensity?: number;
}

export default function LightingSetup({
  keyLightIntensity = 2.0,
  ambientIntensity = 0.2,
}: LightingSetupProps) {
  const directionalRef = useRef<DirectionalLight>(null);
  const spotRef = useRef<SpotLight>(null);

  return (
    <>
      <ambientLight intensity={ambientIntensity} color="#ffffff" />

      <directionalLight
        ref={directionalRef}
        position={[5, 8, 5]}
        intensity={keyLightIntensity}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <directionalLight
        position={[-4, 4, -4]}
        intensity={0.8}
        color="#c7d2fe"
      />

      <spotLight
        ref={spotRef}
        position={[0, 12, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <pointLight position={[-3, 3, -5]} intensity={0.8} color="#818cf8" />
      <pointLight position={[3, 2, 4]} intensity={0.5} color="#f0abfc" />
      <pointLight position={[0, -3, 0]} intensity={0.3} color="#6366f1" />

      <hemisphereLight
        args={["#a5b4fc", "#1e1b4b", 0.4]}
        position={[0, 50, 0]}
      />
    </>
  );
}
