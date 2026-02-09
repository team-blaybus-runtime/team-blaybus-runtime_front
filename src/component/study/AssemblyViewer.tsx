"use client";

import React, {
  Component,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from "react";
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
import { StudyComponent } from "@/apis/study";
import { getAssemblyGroupRotation } from "@/data/assemblyLayouts";
import type { AssemblyInstance } from "@/data/assemblyInstances";
import { getExplodeOffset } from "@/data/assemblyInstances";

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
  productType?: string;
  assemblyInstances?: AssemblyInstance[];
}

interface PartData {
  object: Object3D;
  originalPosition: Vector3;
  explodeDirection: Vector3;
  /** 조립도 전용: explodeLevel=1일 때의 목표 위치 (설정 있으면 보간) */
  layoutPosition?: Vector3;
}

// 선택 하이라이트 — 강하게
const HIGHLIGHT_EMISSIVE = new Color("#3399FF");
const DEFAULT_EMISSIVE = new Color("#000000");

const S3_HOST =
  "https://blaybus-runtime-bucket.s3.ap-northeast-2.amazonaws.com";

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

  // 지오메트리를 원점에 센터링 + 원래 위치 offset 계산
  const { centeredScene, offset } = useMemo(() => {
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

    // 지오메트리 중심을 원점으로 이동
    const box = new Box3().setFromObject(clone);
    const center = new Vector3();
    box.getCenter(center);
    clone.position.sub(center);

    return { centeredScene: clone, offset: center };
  }, [scene]);

  // 선택 하이라이트
  useEffect(() => {
    centeredScene.traverse((child: Object3D) => {
      if (
        child instanceof Mesh &&
        child.material instanceof MeshStandardMaterial
      ) {
        child.material.emissive = isSelected
          ? HIGHLIGHT_EMISSIVE
          : DEFAULT_EMISSIVE;
        child.material.emissiveIntensity = isSelected ? 1.0 : 0;
      }
    });
  }, [isSelected, centeredScene]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(index);
    },
    [index, onSelect],
  );

  const innerRefCallback = useCallback(
    (el: Group | null) => {
      registerRef(index, el);
    },
    [registerRef, index],
  );

  return (
    <group visible={isVisible}>
      {/* offset wrapper: 원래 위치 보정 (explode는 가장 바깥 group을 이동) */}
      <group position={[offset.x, offset.y, offset.z]}>
        {/* inner group: TransformControls 대상 — 원점 = 지오메트리 중심 */}
        <group
          ref={innerRefCallback}
          onClick={handleClick}
          scale={isSelected ? 1.03 : 1}
        >
          <primitive object={centeredScene} />
        </group>
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
        beforeRef.current = {
          position: partObject.position.toArray() as [number, number, number],
          rotation: [
            partObject.rotation.x,
            partObject.rotation.y,
            partObject.rotation.z,
          ],
        };
      } else if (beforeRef.current) {
        pushHistory({
          type: "transform",
          partIndex,
          before: beforeRef.current,
          after: {
            position: partObject.position.toArray() as [number, number, number],
            rotation: [
              partObject.rotation.x,
              partObject.rotation.y,
              partObject.rotation.z,
            ],
          },
        });
        beforeRef.current = null;
      }
    };

    controls.addEventListener("dragging-changed", onDraggingChanged);
    return () =>
      controls.removeEventListener("dragging-changed", onDraggingChanged);
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

export default function AssemblyViewer({
  components,
  productType,
  assemblyInstances,
}: AssemblyViewerProps) {
  const groupRef = useRef<Group>(null);
  const { explodeLevel, setIsLoading, hiddenParts } = useModelStore();
  const {
    activeTool,
    transformMode,
    selectedPartIndex,
    setSelectedPartIndex,
    resetTransformFlag,
  } = useEditStore();
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

  // 편집 모드 종료 시 객체 이동/회전 초기화
  useEffect(() => {
    if (resetTransformFlag === 0) return;
    innerRefs.current.forEach((group) => {
      group.position.set(0, 0, 0);
      group.rotation.set(0, 0, 0);
    });
  }, [resetTransformFlag]);

  // 클릭 핸들러 — select, translate, rotate 모드에서 파트 선택
  const handlePartSelect = useCallback(
    (index: number) => {
      if (activeTool === "select" || activeTool === "transform") {
        setSelectedPartIndex(selectedPartIndex === index ? null : index);
      }
    },
    [activeTool, selectedPartIndex, setSelectedPartIndex],
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

  const renderInstances: AssemblyInstance[] =
    assemblyInstances ??
    components.map((component, index) => ({
      key: component.componentId,
      component,
      transform: undefined,
      instanceIndex: index,
    }));
  const explodeOffset = productType ? getExplodeOffset(productType) : 0.2;

  // explode 데이터 초기화 (assemblyLayout/instances 있으면 해당 위치 적용)
  useEffect(() => {
    isInitialized.current = false;
    if (!groupRef.current) return;

    const timer = setTimeout(() => {
      const group = groupRef.current;
      if (!group || group.children.length === 0) return;

      const box = new Box3().setFromObject(group);
      box.getCenter(centerRef.current);
      const center = centerRef.current;

      const parts: PartData[] = [];

      const instanceCount = renderInstances.length;
      group.children.forEach((child, i) => {
        const instance = renderInstances[i];
        const comp = instance?.component;
        const layout = comp?.assemblyLayout;

        let originalPos: Vector3;
        let direction: Vector3;
        let layoutPosition: Vector3 | undefined;

        if (instance?.transform?.position) {
          const pos = instance.transform.position;
          originalPos = new Vector3(pos[0], pos[1], pos[2]);
          if (instance.transform.explodedPosition) {
            const epos = instance.transform.explodedPosition;
            layoutPosition = new Vector3(epos[0], epos[1], epos[2]);
            direction = layoutPosition.clone().sub(originalPos);
          } else {
            const outward = originalPos.clone().sub(center);
            if (outward.length() < 0.001) {
              const spread = i - (instanceCount - 1) / 2;
              outward.set(spread, 0, 0);
            } else {
              outward.normalize();
            }
            layoutPosition = originalPos
              .clone()
              .add(outward.multiplyScalar(explodeOffset));
            direction = layoutPosition.clone().sub(originalPos);
          }
          if (direction.length() < 0.001) {
            direction = new Vector3(0, 0, 0);
          } else {
            direction.normalize();
          }
          child.position.copy(originalPos);
          if (instance.transform.rotation) {
            child.rotation.set(
              instance.transform.rotation[0],
              instance.transform.rotation[1],
              instance.transform.rotation[2],
            );
          }
        } else if (layout) {
          const childBox = new Box3().setFromObject(child);
          const childSize = new Vector3();
          childBox.getSize(childSize);
          originalPos = new Vector3(
            layout.assembled[0],
            layout.assembled[1],
            layout.assembled[2],
          );
          layoutPosition = new Vector3(
            layout.exploded[0],
            layout.exploded[1],
            layout.exploded[2],
          );
          direction = layoutPosition.clone().sub(originalPos);
          const deltaLength = direction.length();
          const isSuspension =
            productType?.toLowerCase().replace(/[\s-_]/g, "") === "suspension" ||
            productType?.replace(/[\s-_]/g, "") === "서스펜션";
          const minExplode = Math.max(
            childSize.length() * (isSuspension ? 2.5 : 0.6),
            isSuspension ? 1.0 : 0.2,
          );
          if (deltaLength < 0.001) {
            direction = new Vector3(0, 1, 0);
            layoutPosition = originalPos
              .clone()
              .add(direction.clone().multiplyScalar(minExplode));
          } else if (deltaLength < minExplode) {
            direction.normalize();
            layoutPosition = originalPos
              .clone()
              .add(direction.clone().multiplyScalar(minExplode));
          } else {
            direction.normalize();
          }
          child.position.copy(originalPos);
        } else {
          const childBox = new Box3().setFromObject(child);
          const childCenter = new Vector3();
          childBox.getCenter(childCenter);
          originalPos = child.position.clone();
          direction = childCenter.clone().sub(center);
          if (direction.length() < 0.01) {
            direction.set(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
            );
          }
          direction.normalize();
        }

        if (layoutPosition) {
          const originDist = originalPos.distanceTo(center);
          const targetDist = layoutPosition.distanceTo(center);
          if (targetDist < originDist) {
            const temp = originalPos;
            originalPos = layoutPosition;
            layoutPosition = temp;
          }
        }

        parts.push({
          object: child,
          originalPosition: originalPos,
          explodeDirection: direction,
          layoutPosition,
        });
      });

      partsRef.current = parts;
      isInitialized.current = true;
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [components, renderInstances, setIsLoading]);

  // undo/redo 구독 — inner group에 transform 복원
  useEffect(() => {
    const unsub = useEditStore.subscribe((state, prev) => {
      // Undo: history가 줄고 future가 늘었을 때
      if (
        state.history.length < prev.history.length &&
        state.future.length > prev.future.length
      ) {
        const entry = state.future[state.future.length - 1];
        const innerGroup = innerRefs.current.get(entry.partIndex);
        if (innerGroup) {
          innerGroup.position.set(...entry.before.position);
          innerGroup.rotation.set(...entry.before.rotation);
        }
      }
      // Redo: future가 줄고 history가 늘었을 때
      if (
        state.history.length > prev.history.length &&
        state.future.length < prev.future.length
      ) {
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
      let targetPosition: Vector3;
      if (part.layoutPosition) {
        targetPosition = part.originalPosition
          .clone()
          .lerp(part.layoutPosition, explodeLevel);
      } else {
        targetPosition = part.originalPosition
          .clone()
          .add(
            part.explodeDirection
              .clone()
              .multiplyScalar(explodeLevel * explodeDistance),
          );
      }

      part.object.position.lerp(targetPosition, 0.1);
    });
  });

  const groupRotation = productType
    ? getAssemblyGroupRotation(productType)
    : undefined;

  return (
    <>
      <Center>
        <group
          ref={groupRef}
          onPointerMissed={handleMissClick}
          rotation={
            groupRotation
              ? [groupRotation[0], groupRotation[1], groupRotation[2]]
              : undefined
          }
        >
          {renderInstances.map((instance, i) => (
            <PartErrorBoundary
              key={instance.key}
              partName={instance.component.componentName}
            >
              <ComponentModel
                glbUrl={instance.component.glbUrl}
                index={i}
                isSelected={selectedPartIndex === i}
                isVisible={!hiddenParts.has(i)}
                onSelect={handlePartSelect}
                registerRef={registerRef}
              />
            </PartErrorBoundary>
          ))}
        </group>
      </Center>

      {transformTarget && selectedPartIndex !== null && isTransformTool && (
        <PartTransformHandler
          key={`transform-${selectedPartIndex}-${transformMode}`}
          partObject={transformTarget}
          partIndex={selectedPartIndex}
          mode={transformMode}
        />
      )}
    </>
  );
}
