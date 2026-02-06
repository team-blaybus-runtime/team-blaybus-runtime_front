"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import {
  Group,
  Vector3,
  Box3,
  Object3D,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { useModelStore } from "@/store/useModelStore";
import { StudyComponent } from "@/apis/studyApi";

interface AssemblyViewerProps {
  components: StudyComponent[];
}

interface PartData {
  object: Object3D;
  originalPosition: Vector3;
  explodeDirection: Vector3;
}

function ComponentModel({ glbUrl }: { glbUrl: string }) {
  const { scene } = useGLTF(glbUrl);

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

  return <primitive object={clonedScene} />;
}

export default function AssemblyViewer({ components }: AssemblyViewerProps) {
  const groupRef = useRef<Group>(null);
  const { explodeLevel, setIsLoading } = useModelStore();
  const partsRef = useRef<PartData[]>([]);
  const centerRef = useRef<Vector3>(new Vector3());
  const isInitialized = useRef(false);

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
      <group ref={groupRef}>
        {components.map((comp) => (
          <ComponentModel key={comp.componentId} glbUrl={comp.glbUrl} />
        ))}
      </group>
    </Center>
  );
}
