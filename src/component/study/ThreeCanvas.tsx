"use client";

import { Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Bounds } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  N8AO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Vector3 } from "three";
import styled from "styled-components";
import LightingSetup from "@/component/study/LightingSetup";
import AssemblyViewer from "@/component/study/AssemblyViewer";
import { useRenderStore } from "@/store/useRenderStore";
import { useModelStore } from "@/store/useModelStore";
import { useEditStore } from "@/store/useEditStore";
import { useSimulatorStore } from "@/store/useSimulatorStore";
import { StudyComponent } from "@/apis/studyApi";

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

/** 편집 도구 액션(zoom, focus, undo, redo)을 Three.js 카메라에 반영 */
function EditToolHandler({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const { zoomAction, focusAction, clearAction, pushCameraSnapshot, undo, redo, activeTool } = useEditStore();

  // OrbitControls 조작 끝날 때 카메라 스냅샷 저장
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleEnd = () => {
      pushCameraSnapshot({
        position: camera.position.toArray() as [number, number, number],
        target: [controls.target.x, controls.target.y, controls.target.z],
      });
    };

    controls.addEventListener("end", handleEnd);
    return () => controls.removeEventListener("end", handleEnd);
  }, [controlsRef, camera, pushCameraSnapshot]);

  // zoom in / zoom out 액션 처리
  useEffect(() => {
    if (!zoomAction || !controlsRef.current) return;

    const controls = controlsRef.current;
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    const distance = zoomAction === "in" ? 1 : -1;

    camera.position.addScaledVector(dir, distance);
    controls.update();
    clearAction();
  }, [zoomAction, camera, controlsRef, clearAction]);

  // focus 액션 처리 - 카메라를 기본 위치로 리셋
  useEffect(() => {
    if (!focusAction || !controlsRef.current) return;

    const controls = controlsRef.current;
    camera.position.set(3, 2, 3);
    controls.target.set(0, 0, 0);
    controls.update();
    clearAction();
  }, [focusAction, camera, controlsRef, clearAction]);

  // undo/redo 시 카메라 복원
  useEffect(() => {
    const unsub = useEditStore.subscribe((state, prev) => {
      // undo가 호출되어 history가 줄었으면 future 마지막 항목이 복원 대상
      if (state.cameraHistory.length < prev.cameraHistory.length && state.cameraFuture.length > prev.cameraFuture.length) {
        const snapshot = state.cameraFuture[state.cameraFuture.length - 1];
        if (snapshot && controlsRef.current) {
          camera.position.set(...snapshot.position);
          controlsRef.current.target.set(...snapshot.target);
          controlsRef.current.update();
        }
      }
      // redo가 호출되어 history가 늘었으면 history 마지막 항목이 복원 대상
      if (state.cameraHistory.length > prev.cameraHistory.length && state.cameraFuture.length < prev.cameraFuture.length) {
        const snapshot = state.cameraHistory[state.cameraHistory.length - 1];
        if (snapshot && controlsRef.current) {
          camera.position.set(...snapshot.position);
          controlsRef.current.target.set(...snapshot.target);
          controlsRef.current.update();
        }
      }
    });
    return unsub;
  }, [camera, controlsRef]);

  return null;
}

/** 시뮬레이터 타임라인 → explodeLevel 동기화 */
function SimulatorSync() {
  const { currentTime, duration, isPlaying } = useSimulatorStore();
  const { setExplodeLevel } = useModelStore();

  useFrame(() => {
    if (!isPlaying && currentTime === 0) return;
    const progress = duration > 0 ? currentTime / duration : 0;
    setExplodeLevel(progress);
  });

  return null;
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
          ref={controlsRef}
          enabled={!isTransforming}
          enablePan={true}
          enableZoom={true}
          enableRotate={!isPan}
          mouseButtons={{
            LEFT: isPan ? 2 : 0,   // pan모드: 좌클릭=팬, 기본: 좌클릭=회전
            MIDDLE: 1,
            RIGHT: isPan ? 0 : 2,
          }}
          minDistance={0.5}
          maxDistance={30}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          enableDamping
        />

        <EditToolHandler controlsRef={controlsRef} />
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
