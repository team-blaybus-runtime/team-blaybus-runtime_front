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
  Quaternion,
} from "three";
import { useModelStore } from "@/store/useModelStore";
import { useRenderStore } from "@/store/useRenderStore";
import { useEditStore, type TransformData } from "@/store/useEditStore";
import { StudyComponent } from "@/apis/study";
import { StudyTab } from "@/component/study/StudyTabBar";
import { getAssemblyGroupRotation } from "@/data/productLayouts";
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
  activeTab?: StudyTab;
  productType?: string;
  assemblyInstances?: AssemblyInstance[];
}

interface PartData {
  object: Object3D;
  originalPosition: Vector3;
  explodeDirection: Vector3;
  /** 조립도 전용: explodeLevel=1일 때의 목표 위치 (설정 있으면 보간) */
  layoutPosition?: Vector3;
  /** 분해 시작 딜레이 (0~0.35) — 중심 가까운 파트가 먼저, 같은 방향은 시차 */
  explodeDelay: number;
}

// 선택 하이라이트
const HIGHLIGHT_EMISSIVE = new Color("#66BBFF");
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
  const material = useRenderStore((s) => s.material);

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
          roughness: material.roughness,
          metalness: material.metalness,
          envMapIntensity: material.envMapIntensity,
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

  // 재질 값 실시간 반영
  useEffect(() => {
    centeredScene.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.roughness = material.roughness;
        child.material.metalness = material.metalness;
        child.material.envMapIntensity = material.envMapIntensity;
        child.material.needsUpdate = true;
      }
    });
  }, [material, centeredScene]);

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
        child.material.emissiveIntensity = isSelected ? 1.5 : 0;
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
          scale={isSelected ? 1.05 : 1}
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
  activeTab,
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
    selectedComponentId,
    setSelectedComponentId,
    resetTransformFlag,
  } = useEditStore();
  const partsRef = useRef<PartData[]>([]);
  const centerRef = useRef<Vector3>(new Vector3());
  const isInitialized = useRef(false);
  const earlyPositionApplied = useRef(false);

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

  // 클릭 핸들러 — select, translate, rotate 모드에서 파트 선택 (컴포넌트 단위)
  const handlePartSelect = useCallback(
    (index: number) => {
      if (activeTool === "select" || activeTool === "transform") {
        const componentId =
          renderInstances[index]?.component.componentId ?? null;
        if (selectedComponentId === componentId) {
          setSelectedComponentId(null);
        } else {
          setSelectedComponentId(componentId);
          setSelectedPartIndex(index);
        }
      }
    },
    [
      activeTool,
      selectedComponentId,
      setSelectedComponentId,
      setSelectedPartIndex,
      renderInstances,
    ],
  );

  const handleMissClick = useCallback(() => {
    if (activeTool === "select" || activeTool === "transform") {
      setSelectedComponentId(null);
    }
  }, [activeTool, setSelectedComponentId]);
  const explodeOffset = productType ? getExplodeOffset(productType) : 0.2;

  // explode 데이터 초기화 — 중심점 기준 방사형 + 인접 부품 분리력
  useEffect(() => {
    isInitialized.current = false;
    earlyPositionApplied.current = false;
    if (!groupRef.current) return;

    const timer = setTimeout(() => {
      const group = groupRef.current;
      if (!group || group.children.length === 0) return;

      const box = new Box3().setFromObject(group);
      box.getCenter(centerRef.current);
      const center = centerRef.current;

      // 모델 전체 크기 (분리 거리 스케일링용)
      const modelSize = new Vector3();
      box.getSize(modelSize);
      const modelDiag = modelSize.length();

      // ── Phase 1: 각 파트의 기본 데이터 수집 ──
      interface PartSetup {
        child: Object3D;
        originalPos: Vector3;
        childCenter: Vector3;
        partRadius: number; // 파트 개별 바운딩 반경
        autoExplode: boolean; // explodedPosition 없으면 자동 계산
        layoutPosition?: Vector3;
      }

      const setups: PartSetup[] = [];

      group.children.forEach((child, i) => {
        const instance = renderInstances[i];
        let originalPos: Vector3;
        let layoutPosition: Vector3 | undefined;
        let autoExplode = true;

        if (instance?.transform?.position) {
          const pos = instance.transform.position;
          originalPos = new Vector3(pos[0], pos[1], pos[2]);
          child.position.copy(originalPos);
          if (instance.transform.quaternion) {
            const q = instance.transform.quaternion;
            child.quaternion.set(q[0], q[1], q[2], q[3]).normalize();
          } else if (instance.transform.rotation) {
            child.rotation.set(
              instance.transform.rotation[0],
              instance.transform.rotation[1],
              instance.transform.rotation[2],
            );
          }
          if (instance.transform.explodedPosition) {
            const epos = instance.transform.explodedPosition;
            layoutPosition = new Vector3(epos[0], epos[1], epos[2]);
            autoExplode = false;
          }
        } else {
          originalPos = child.position.clone();
        }

        const childBox = new Box3().setFromObject(child);
        const childCenter = new Vector3();
        childBox.getCenter(childCenter);
        const partSize = new Vector3();
        childBox.getSize(partSize);
        const partRadius = partSize.length() / 2;

        setups.push({ child, originalPos, childCenter, partRadius, autoExplode, layoutPosition });
      });

      // ── Phase 2: 피보나치 스피어로 고유 방향 보장 + 파트 크기 비례 거리 ──
      const centroid = new Vector3();
      setups.forEach((s) => centroid.add(s.originalPos));
      centroid.divideScalar(setups.length || 1);

      // 자동분해 파트만 추출 → 중심 거리순 정렬 (바깥 파트 = 낮은 rank)
      const autoEntries = setups
        .map((s, i) => ({ i, dist: s.originalPos.distanceTo(centroid) }))
        .filter((_, i) => setups[i].autoExplode)
        .sort((a, b) => b.dist - a.dist); // 바깥부터

      // 피보나치 스피어: N개 점을 구 표면에 균등 분포
      const golden = (1 + Math.sqrt(5)) / 2;
      const totalAuto = autoEntries.length;
      const directions = new Array<Vector3>(setups.length).fill(new Vector3());

      autoEntries.forEach(({ i }, rank) => {
        // 자연스러운 방향 (30%) + 피보나치 구형 분포 (70%) 블렌딩
        const natural = setups[i].originalPos.clone().sub(centroid);
        const hasNatural = natural.length() > 0.001;
        if (hasNatural) natural.normalize();

        const theta = (2 * Math.PI * rank) / golden;
        const phi = Math.acos(1 - (2 * (rank + 0.5)) / totalAuto);
        const sphere = new Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        );

        const dir = hasNatural
          ? natural.multiplyScalar(0.3).add(sphere.multiplyScalar(0.7))
          : sphere;
        directions[i] = dir.normalize();
      });

      // ── Phase 3: 최종 PartData 생성 ──
      const MAX_DELAY = 0.3;
      let maxDistFromCentroid = 0;
      setups.forEach((s) => {
        const d = s.originalPos.distanceTo(centroid);
        if (d > maxDistFromCentroid) maxDistFromCentroid = d;
      });
      if (maxDistFromCentroid < 0.001) maxDistFromCentroid = 1;

      const parts: PartData[] = setups.map((setup, i) => {
        // 명시적 explodedPosition → 그대로 사용
        if (!setup.autoExplode && setup.layoutPosition) {
          let op = setup.originalPos;
          let lp = setup.layoutPosition;
          if (lp.distanceTo(centroid) < op.distanceTo(centroid)) {
            const tmp = op; op = lp; lp = tmp;
          }
          const dir = lp.clone().sub(op);
          const distRatio = 1 - op.distanceTo(centroid) / maxDistFromCentroid;
          return {
            object: setup.child,
            originalPosition: op,
            explodeDirection: dir.length() > 0.001 ? dir.normalize() : dir.set(0, 0, 0),
            layoutPosition: lp,
            explodeDelay: distRatio * MAX_DELAY * 0.5,
          };
        }

        // 분해 거리: 파트 지름 × 2 (자기 크기의 2배만큼 이동 → 명확한 분리)
        const minDist = Math.max(explodeOffset, modelDiag * 0.1);
        const explodeDist = minDist + setup.partRadius * 4;
        const layoutPos = setup.originalPos.clone().add(
          directions[i].clone().multiplyScalar(explodeDist),
        );

        // 딜레이: 바깥 파트 먼저
        const distRatio = setup.originalPos.distanceTo(centroid) / maxDistFromCentroid;
        const delay = (1 - distRatio) * MAX_DELAY * 0.7 + (i / setups.length) * MAX_DELAY * 0.3;

        return {
          object: setup.child,
          originalPosition: setup.originalPos,
          explodeDirection: directions[i],
          layoutPosition: layoutPos,
          explodeDelay: Math.min(delay, MAX_DELAY),
        };
      });

      partsRef.current = parts;
      isInitialized.current = true;
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [components, renderInstances, setIsLoading, explodeOffset]);

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
    if (!isInitialized.current) {
      // 초기화 전에 transform 데이터로 위치 즉시 적용 (깜빡임 방지)
      if (!earlyPositionApplied.current && groupRef.current) {
        const group = groupRef.current;
        if (group.children.length > 0) {
          group.children.forEach((child, i) => {
            const instance = renderInstances[i];
            if (instance?.transform?.position) {
              const pos = instance.transform.position;
              child.position.set(pos[0], pos[1], pos[2]);
              if (instance.transform.quaternion) {
                const q = instance.transform.quaternion;
                child.quaternion.set(q[0], q[1], q[2], q[3]).normalize();
              } else if (instance.transform.rotation) {
                child.rotation.set(
                  instance.transform.rotation[0],
                  instance.transform.rotation[1],
                  instance.transform.rotation[2],
                );
              }
            }
          });
          earlyPositionApplied.current = true;
        }
      }
      return;
    }

    partsRef.current.forEach((part) => {
      // 딜레이 적용: 중심 파트부터 순차적으로 분해 시작
      const d = part.explodeDelay;
      const effective = d > 0
        ? Math.max(0, Math.min(1, (explodeLevel - d) / (1 - d)))
        : explodeLevel;

      const targetPosition = part.layoutPosition
        ? part.originalPosition.clone().lerp(part.layoutPosition, effective)
        : part.originalPosition.clone().add(
            part.explodeDirection.clone().multiplyScalar(effective * 2.0),
          );

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
                isSelected={
                  selectedComponentId !== null &&
                  selectedComponentId === instance.component.componentId
                }
                isVisible={!hiddenParts.has(instance.component.componentId)}
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
