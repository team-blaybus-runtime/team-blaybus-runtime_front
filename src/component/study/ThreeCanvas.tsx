"use client";

import { Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Bounds, useBounds } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  N8AO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Vector3, MOUSE } from "three";
import styled from "styled-components";
import LightingSetup from "@/component/study/LightingSetup";
import AssemblyViewer from "@/component/study/AssemblyViewer";
import { useRenderStore } from "@/store/useRenderStore";
import { useModelStore } from "@/store/useModelStore";
import { useEditStore } from "@/store/useEditStore";
import { useSimulatorStore } from "@/store/useSimulatorStore";
import { StudyComponent } from "@/apis/study";

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

/** 편집 도구 액션(zoom, focus)을 Three.js 카메라에 반영 */
function EditToolHandler({
  controlsRef,
  boundsApi,
}: {
  controlsRef: React.RefObject<any>;
  boundsApi: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const { zoomAction, focusAction, clearAction } = useEditStore();

  // zoom in / zoom out 액션 처리
  useEffect(() => {
    if (!zoomAction || !controlsRef.current) return;

    const controls = controlsRef.current;
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    const currentDist = camera.position.distanceTo(controls.target);
    const step = currentDist * 0.25;
    const distance = zoomAction === "in" ? step : -step;

    camera.position.addScaledVector(dir, distance);
    controls.update();
    clearAction();
  }, [zoomAction, camera, controlsRef, clearAction]);

  // focus 액션 처리 - Bounds.refresh()로 모델에 맞게 카메라 리셋
  useEffect(() => {
    if (!focusAction) return;

    if (boundsApi.current) {
      boundsApi.current.refresh().clip().fit();
    }
    clearAction();
  }, [focusAction, boundsApi, clearAction]);

  return null;
}

/** 시뮬레이터 타임라인 → explodeLevel 동기화 */
function SimulatorSync() {
  const { currentTime, duration, isPlaying } = useSimulatorStore();
  const { setExplodeLevel } = useModelStore();
  const prevTimeRef = useRef(currentTime);

  useFrame(() => {
    const progress = duration > 0 ? currentTime / duration : 0;

    if (isPlaying) {
      setExplodeLevel(progress);
    } else if (prevTimeRef.current !== currentTime) {
      // 리셋 또는 트랙 클릭으로 시간이 바뀐 경우 동기화
      setExplodeLevel(progress);
    }

    prevTimeRef.current = currentTime;
  });

  return null;
}

/** Bounds 내부에서 useBounds API를 ref로 전달하는 래퍼 */
function BoundsContent({
  children,
  boundsApi,
}: {
  children: React.ReactNode;
  boundsApi: React.MutableRefObject<any>;
}) {
  const api = useBounds();
  useEffect(() => {
    boundsApi.current = api;
  }, [api, boundsApi]);
  return <>{children}</>;
}

interface ThreeCanvasProps {
  components: StudyComponent[];
}

export default function ThreeCanvas({ components }: ThreeCanvasProps) {
  const { bloom, ao, lighting } = useRenderStore();
  const { isTransforming, explodeLevel, setExplodeLevel } = useModelStore();
  const activeTool = useEditStore((s) => s.activeTool);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const boundsApiRef = useRef<any>(null);

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

  // 도구별 OrbitControls 설정
  const isPan = activeTool === "pan";

  return (
    <CanvasContainer ref={containerRef}>
      <Canvas
        shadows
        camera={{ position: [3, 2, 3], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
      >
        <color attach="background" args={["#2b2b2b"]} />

        <LightingSetup
          keyLightIntensity={lighting.keyLightIntensity}
          ambientIntensity={lighting.ambientIntensity}
        />

        <Suspense fallback={<LoadingFallback />}>
          {components.length > 0 && (
            <Bounds fit clip margin={1.5}>
              <BoundsContent boundsApi={boundsApiRef}>
                <AssemblyViewer components={components} />
              </BoundsContent>
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
          ref={controlsRef}
          enabled={!isTransforming}
          enablePan={true}
          enableZoom={true}
          enableRotate={!isPan}
          mouseButtons={{
            LEFT: isPan ? MOUSE.PAN : MOUSE.ROTATE,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: isPan ? MOUSE.ROTATE : MOUSE.PAN,
          }}
          minDistance={0.1}
          maxDistance={100}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          dampingFactor={0.05}
          enableDamping
        />

        <EditToolHandler controlsRef={controlsRef} boundsApi={boundsApiRef} />
        <SimulatorSync />

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
