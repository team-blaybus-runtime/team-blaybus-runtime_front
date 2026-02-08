"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
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
import { useEditStore } from "@/store/useEditStore";
import { StudyComponent } from "@/apis/studyApi";

interface AssemblyViewerProps {
  components: StudyComponent[];
}

interface PartData {
  object: Object3D;
  originalPosition: Vector3;
  explodeDirection: Vector3;
}

// 선택 하이라이트 색상
const HIGHLIGHT_EMISSIVE = new Color("#006FFF");
const DEFAULT_EMISSIVE = new Color("#000000");

function ComponentModel({
  glbUrl,
  index,
  isSelected,
  isVisible,
  onSelect,
}: {
  glbUrl: string;
  index: number;
  isSelected: boolean;
  isVisible: boolean;
  onSelect: (index: number) => void;
}) {
  const { scene } = useGLTF(glbUrl);
  const groupRef = useRef<Group>(null);

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

  // 선택 상태에 따른 하이라이트 업데이트
  useEffect(() => {
    clonedScene.traverse((child: Object3D) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material.emissive = isSelected ? HIGHLIGHT_EMISSIVE : DEFAULT_EMISSIVE;
        child.material.emissiveIntensity = isSelected ? 0.3 : 0;
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

  return (
    <group ref={groupRef} onClick={handleClick} visible={isVisible}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function AssemblyViewer({ components }: AssemblyViewerProps) {
  const groupRef = useRef<Group>(null);
  const { explodeLevel, setIsLoading, hiddenParts } = useModelStore();
  const { activeTool, selectedPartIndex, setSelectedPartIndex } = useEditStore();
  const partsRef = useRef<PartData[]>([]);
  const centerRef = useRef<Vector3>(new Vector3());
  const isInitialized = useRef(false);

  // 클릭 핸들러 - select 모드일 때만 파트 선택
  const handlePartSelect = useCallback(
    (index: number) => {
      if (activeTool !== "select") return;
      setSelectedPartIndex(selectedPartIndex === index ? null : index);
    },
    [activeTool, selectedPartIndex, setSelectedPartIndex]
  );

  // 배경 클릭 시 선택 해제
  const handleMissClick = useCallback(() => {
    if (activeTool === "select") {
      setSelectedPartIndex(null);
    }
  }, [activeTool, setSelectedPartIndex]);

  // 모든 컴포넌트 GLB preload
  useEffect(() => {
    components.forEach((comp) => {
      useGLTF.preload(comp.glbUrl);
    });
  }, [components]);

  // 조립체 로드 완료 후 explode 데이터 초기화
  useEffect(() => {
    if (!groupRef.current || isInitialized.current) return;

    // 짧은 지연으로 모든 자식이 마운트되길 대기
    const timer = setTimeout(() => {
      const group = groupRef.current;
      if (!group || group.children.length === 0) return;

      // 전체 조립체 중심점 계산
      const box = new Box3().setFromObject(group);
      box.getCenter(centerRef.current);

      const parts: PartData[] = [];

      // 각 컴포넌트(직접 자식)를 하나의 파트로 처리
      group.children.forEach((child) => {
        const childBox = new Box3().setFromObject(child);
        const childCenter = new Vector3();
        childBox.getCenter(childCenter);

        const originalPos = child.position.clone();

        // 조립체 중심에서 컴포넌트 중심 방향
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

  // Explode 애니메이션
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
          <ComponentModel
            key={comp.componentId}
            glbUrl={comp.glbUrl}
            index={i}
            isSelected={selectedPartIndex === i}
            isVisible={!hiddenParts.has(i)}
            onSelect={handlePartSelect}
          />
        ))}
      </group>
    </Center>
  );
}
