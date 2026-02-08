"use client";

import React, { Component, useRef, useMemo, useEffect, useCallback, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Center, TransformControls } from "@react-three/drei";
import {
  Group,
  Vector3,
  Box3,
  Object3D,
  Mesh,
  MeshStandardMaterial,
  Color,
} from "three";
import { useModelStore } from "@/store/useModelStore";
import { useEditStore, type TransformData } from "@/store/useEditStore";
import { StudyComponent } from "@/apis/studyApi";

/** GLB 로드 실패 시 해당 파트만 건너뛰는 에러 바운더리 */
class PartErrorBoundary extends Component<
  { children: React.ReactNode; partName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; partName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn(`[GLB 로드 실패] ${this.props.partName}:`, error.message);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface AssemblyViewerProps {
  components: StudyComponent[];
}

interface PartData {
  object: Object3D;
  originalPosition: Vector3;
  explodeDirection: Vector3;
}

// 선택 하이라이트 — 강하게
const HIGHLIGHT_EMISSIVE = new Color("#3399FF");
const DEFAULT_EMISSIVE = new Color("#000000");

const S3_HOST = "https://blaybus-runtime-bucket.s3.ap-northeast-2.amazonaws.com";

function toProxyUrl(url: string) {
  if (url.startsWith(S3_HOST)) {
    return url.replace(S3_HOST, "/s3-proxy");
  }
  return url;
}

function ComponentModel({
  glbUrl,
  index,
  isSelected,
  isVisible,
  onSelect,
  registerRef,
}: {
  glbUrl: string;
  index: number;
  isSelected: boolean;
  isVisible: boolean;
  onSelect: (index: number) => void;
  registerRef: (index: number, el: Group | null) => void;
}) {
  const { scene } = useGLTF(toProxyUrl(glbUrl));

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.material) {
        const originalMaterial = child.material as MeshStandardMaterial;
        child.material = new MeshStandardMaterial({
          color: originalMaterial.color,
          map: originalMaterial.map,
          normalMap: originalMaterial.normalMap,
          roughness: 0.4,
          metalness: 0.6,
          envMapIntensity: 1.0,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // 선택 하이라이트
  useEffect(() => {
    clonedScene.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.emissive = isSelected ? HIGHLIGHT_EMISSIVE : DEFAULT_EMISSIVE;
        child.material.emissiveIntensity = isSelected ? 1.0 : 0;
      }
    });
  }, [isSelected, clonedScene]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(index);
    },
    [index, onSelect]
  );

  const innerRefCallback = useCallback(
    (el: Group | null) => {
      registerRef(index, el);
    },
    [registerRef, index]
  );

  return (
    <group visible={isVisible}>
      {/* inner group: TransformControls 대상 + 선택 시 살짝 확대 */}
      <group ref={innerRefCallback} onClick={handleClick} scale={isSelected ? 1.03 : 1}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/** TransformControls 래퍼 — 드래그 시작/끝 시 히스토리 기록 */
function PartTransformHandler({
  partObject,
  partIndex,
  mode,
}: {
  partObject: Group;
  partIndex: number;
  mode: "translate" | "rotate";
}) {
  const { setIsTransforming } = useModelStore();
  const { pushHistory } = useEditStore();
  const controlsRef = useRef<any>(null);
  const beforeRef = useRef<TransformData | null>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !controls.addEventListener) return;

    const onDraggingChanged = (event: { value: boolean }) => {
      setIsTransforming(event.value);

      if (event.value) {
        // 드래그 시작 — before 저장
        beforeRef.current = {
          position: partObject.position.toArray() as [number, number, number],
          rotation: [partObject.rotation.x, partObject.rotation.y, partObject.rotation.z],
        };
      } else if (beforeRef.current) {
        // 드래그 끝 — after 저장 + 히스토리 push
        pushHistory({
          type: "transform",
          partIndex,
          before: beforeRef.current,
          after: {
            position: partObject.position.toArray() as [number, number, number],
            rotation: [partObject.rotation.x, partObject.rotation.y, partObject.rotation.z],
          },
        });
        beforeRef.current = null;
      }
    };

    controls.addEventListener("dragging-changed", onDraggingChanged);
    return () => controls.removeEventListener("dragging-changed", onDraggingChanged);
  }, [partObject, partIndex, setIsTransforming, pushHistory]);

  return (
    <TransformControls
      ref={controlsRef}
      object={partObject}
      mode={mode}
      size={0.8}
    />
  );
}

export default function AssemblyViewer({ components }: AssemblyViewerProps) {
  const groupRef = useRef<Group>(null);
  const { explodeLevel, setIsLoading, hiddenParts } = useModelStore();
  const { activeTool, transformMode, selectedPartIndex, setSelectedPartIndex } = useEditStore();
  const partsRef = useRef<PartData[]>([]);
  const centerRef = useRef<Vector3>(new Vector3());
  const isInitialized = useRef(false);

  // inner group refs (TransformControls 대상)
  const innerRefs = useRef<Map<number, Group>>(new Map());
  const [transformTarget, setTransformTarget] = useState<Group | null>(null);

  const isTransformTool = activeTool === "transform";

  // 선택 또는 도구 변경 시 transform target 업데이트
  useEffect(() => {
    if (isTransformTool && selectedPartIndex !== null) {
      setTransformTarget(innerRefs.current.get(selectedPartIndex) ?? null);
    } else {
      setTransformTarget(null);
    }
  }, [selectedPartIndex, isTransformTool]);

  const registerRef = useCallback((index: number, el: Group | null) => {
    if (el) innerRefs.current.set(index, el);
    else innerRefs.current.delete(index);
  }, []);

  // 클릭 핸들러 — select, translate, rotate 모드에서 파트 선택
  const handlePartSelect = useCallback(
    (index: number) => {
      if (activeTool === "select" || activeTool === "transform") {
        setSelectedPartIndex(selectedPartIndex === index ? null : index);
      }
    },
    [activeTool, selectedPartIndex, setSelectedPartIndex]
  );

  const handleMissClick = useCallback(() => {
    if (activeTool === "select" || activeTool === "transform") {
      setSelectedPartIndex(null);
    }
  }, [activeTool, setSelectedPartIndex]);

  // GLB preload
  useEffect(() => {
    components.forEach((comp) => {
      useGLTF.preload(toProxyUrl(comp.glbUrl));
    });
  }, [components]);

  // explode 데이터 초기화
  useEffect(() => {
    if (!groupRef.current || isInitialized.current) return;

    const timer = setTimeout(() => {
      const group = groupRef.current;
      if (!group || group.children.length === 0) return;

      const box = new Box3().setFromObject(group);
      box.getCenter(centerRef.current);

      const parts: PartData[] = [];

      group.children.forEach((child) => {
        const childBox = new Box3().setFromObject(child);
        const childCenter = new Vector3();
        childBox.getCenter(childCenter);

        const originalPos = child.position.clone();
        const direction = childCenter.clone().sub(centerRef.current);

        if (direction.length() < 0.01) {
          direction.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          );
        }
        direction.normalize();

        parts.push({
          object: child,
          originalPosition: originalPos,
          explodeDirection: direction,
        });
      });

      partsRef.current = parts;
      isInitialized.current = true;
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [components, setIsLoading]);

  // undo/redo 구독 — inner group에 transform 복원
  useEffect(() => {
    const unsub = useEditStore.subscribe((state, prev) => {
      // Undo: history가 줄고 future가 늘었을 때
      if (state.history.length < prev.history.length && state.future.length > prev.future.length) {
        const entry = state.future[state.future.length - 1];
        const innerGroup = innerRefs.current.get(entry.partIndex);
        if (innerGroup) {
          innerGroup.position.set(...entry.before.position);
          innerGroup.rotation.set(...entry.before.rotation);
        }
      }
      // Redo: future가 줄고 history가 늘었을 때
      if (state.history.length > prev.history.length && state.future.length < prev.future.length) {
        const entry = state.history[state.history.length - 1];
        const innerGroup = innerRefs.current.get(entry.partIndex);
        if (innerGroup) {
          innerGroup.position.set(...entry.after.position);
          innerGroup.rotation.set(...entry.after.rotation);
        }
      }
    });
    return unsub;
  }, []);

  // Explode 애니메이션 — outer group만 이동 (inner group의 유저 변환과 충돌 없음)
  useFrame(() => {
    if (!isInitialized.current) return;

    const explodeDistance = 2.0;

    partsRef.current.forEach((part) => {
      const targetPosition = part.originalPosition
        .clone()
        .add(
          part.explodeDirection
            .clone()
            .multiplyScalar(explodeLevel * explodeDistance)
        );

      part.object.position.lerp(targetPosition, 0.1);
    });
  });

  return (
    <Center>
      <group ref={groupRef} onPointerMissed={handleMissClick}>
        {components.map((comp, i) => (
          <PartErrorBoundary key={comp.componentId} partName={comp.componentName}>
            <ComponentModel
              glbUrl={comp.glbUrl}
              index={i}
              isSelected={selectedPartIndex === i}
              isVisible={!hiddenParts.has(i)}
              onSelect={handlePartSelect}
              registerRef={registerRef}
            />
          </PartErrorBoundary>
        ))}
      </group>

      {transformTarget && selectedPartIndex !== null && isTransformTool && (
        <PartTransformHandler
          key={`transform-${selectedPartIndex}-${transformMode}`}
          partObject={transformTarget}
          partIndex={selectedPartIndex}
          mode={transformMode}
        />
      )}
    </Center>
  );
}
