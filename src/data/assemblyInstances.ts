import type { StudyComponent } from "@/apis/study";
import {
  PRODUCT_LAYOUTS,
  EXPLODE_OFFSET_BY_PRODUCT,
  INSTANCE_SCALE_BY_PRODUCT,
} from "./productLayouts";

export type AssemblyPosition = [number, number, number];
export type AssemblyRotation = [number, number, number];
export interface AssemblyTransform {
  position: AssemblyPosition;
  rotation?: AssemblyRotation;
  /** Three.js 좌표계 기준 쿼터니언 [x, y, z, w] — rotation보다 우선 적용 */
  quaternion?: [number, number, number, number];
  explodedPosition?: AssemblyPosition;
}

export interface AssemblyInstance {
  key: string;
  component: StudyComponent;
  transform?: AssemblyTransform;
  instanceIndex: number;
}

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");

const DEFAULT_GRID_SPACING = 0.8;

function getGridPosition(index: number): AssemblyPosition {
  const cols = 4;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const x = (col - (cols - 1) / 2) * DEFAULT_GRID_SPACING;
  const y = -row * DEFAULT_GRID_SPACING;
  return [x, y, 0];
}

function scaleTransform(
  transform: AssemblyTransform,
  scale: number,
): AssemblyTransform {
  if (scale === 1) return transform;
  return {
    ...transform,
    position: [
      transform.position[0] * scale,
      transform.position[1] * scale,
      transform.position[2] * scale,
    ],
    explodedPosition: transform.explodedPosition
      ? [
          transform.explodedPosition[0] * scale,
          transform.explodedPosition[1] * scale,
          transform.explodedPosition[2] * scale,
        ]
      : undefined,
  };
}

export function getAssemblyInstances(
  objectId: string,
  components: StudyComponent[],
): AssemblyInstance[] {
  const productKey = normalizeKey(objectId);
  const layoutMap = PRODUCT_LAYOUTS[productKey] ?? {};
  const instanceScale = INSTANCE_SCALE_BY_PRODUCT[productKey] ?? 1;

  return components.flatMap((component, index) => {
    const nameKey = normalizeKey(component.componentName);
    const transform = layoutMap[nameKey];

    if (Array.isArray(transform)) {
      return transform.map((item, instanceIndex) => ({
        key: `${component.componentId}-${instanceIndex}`,
        component,
        transform: scaleTransform(item, instanceScale),
        instanceIndex,
      }));
    }

    if (transform) {
      return [
        {
          key: component.componentId,
          component,
          transform: scaleTransform(transform, instanceScale),
          instanceIndex: 0,
        },
      ];
    }

    return [
      {
        key: component.componentId,
        component,
        transform: { position: getGridPosition(index) },
        instanceIndex: 0,
      },
    ];
  });
}

export function getExplodeOffset(objectId: string): number {
  return EXPLODE_OFFSET_BY_PRODUCT[normalizeKey(objectId)] ?? 0.2;
}
