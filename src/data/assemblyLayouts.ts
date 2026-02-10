/**
 * 제품별 조립도 레이아웃 (assembled/exploded 위치).
 * partName으로 API 부품과 매칭하여 사용.
 */
export interface PartAssemblyLayout {
  assembled: [number, number, number];
  exploded: [number, number, number];
}

export type ProductAssemblyLayout = Record<string, PartAssemblyLayout>;

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/[\s-_]/g, "");

/** 제품 ID/이름 → 부품별 조립도 설정. partName은 API partName과 일치시킴 */
export const ASSEMBLY_LAYOUTS: Record<string, ProductAssemblyLayout> = {
  Suspension: {
    "Spring Adjustment Nut": {
      assembled: [0, 0.12, 0],
      exploded: [0, 1.2, 0],
    },
    "Lock Nut": {
      assembled: [0, 0.06, 0],
      exploded: [0, 1.0, 0],
    },
    "Upper Mount": {
      assembled: [0, 0, 0],
      exploded: [0, 0, 0],
    },
    "Coil Spring": {
      assembled: [0, 0.02, 0],
      exploded: [0, 0.8, 0],
    },
    "Damper Rod": {
      assembled: [0, 0.1, 0],
      exploded: [0, 0.4, 0],
    },
  },
  Robot_Arm: {
    Base: {
      assembled: [0, 0, 0],
      exploded: [0, -0.3, 0],
    },
    "Base Joint": {
      assembled: [0, 0.43, 0.28],
      exploded: [0, 0.1, 0.5],
    },
    "Shoulder Joint": {
      assembled: [0, 0.1, 0],
      exploded: [0, 0.5, 0],
    },
    "Upper Arm Link": {
      assembled: [0, 0.26, 0.15],
      exploded: [0, 0.9, 0.3],
    },
    "Elbow Joint": {
      assembled: [0, 0.5, -0.2],
      exploded: [0, 1.3, -0.4],
    },
    "Forearm Link": {
      assembled: [0, 0.47, 0.24],
      exploded: [0, 1.7, 0.5],
    },
    "Wrist Joint": {
      assembled: [0, 0.5, 0.1],
      exploded: [0, 2.1, 0.2],
    },
    "End Effector Interface": {
      assembled: [0, 0.5, 0.1],
      exploded: [0, 2.5, 0.2],
    },
  },
  V4_Engine: {
    Crankshaft: {
      assembled: [0, 0.05, 0.3],
      exploded: [0, -0.3, 0],
    },
    "Connecting Rod": {
      assembled: [0.019, 0.25, 0.1435],
      exploded: [0, 0.3, 0.25],
    },
    "Connecting Rod Cap": {
      assembled: [0.04, 0.05, 0.1435],
      exploded: [0, 0.15, 0.25],
    },
    Piston: {
      assembled: [0.022, 0.223, 0.1435],
      exploded: [0, 0.45, 0.25],
    },
    "Piston Pin": {
      assembled: [0.018, 0.25, 0.184],
      exploded: [0, 0.6, 0.25],
    },
    "Piston Ring": {
      assembled: [0.022, 0.223, 0.1435],
      exploded: [0, 0.45, 0.25],
    },
    "Conrod Bolt": {
      assembled: [-0.045, -0.018, 0.008],
      exploded: [0, -0.1, 0.1],
    },
  },
};

/** 씬 스케일 (조립도 위치 단위 보정) */
export const ASSEMBLY_LAYOUT_SCALE: Record<string, number> = {
  Suspension: 1,
  V4_Engine: 1,
  Robot_Arm: 1,
};

/** 분해 거리만 키우고 싶을 때 사용 */
export const ASSEMBLY_EXPLODE_SCALE: Record<string, number> = {
  Suspension: 300,
  V4_Engine: 1,
  Robot_Arm: 1,
};

/** 조립도 전체 회전 (참고 이미지 각도 보정) — normalizeKey로 매칭 */
export const ASSEMBLY_GROUP_ROTATION: Record<string, [number, number, number]> = {
  suspension: [0, 0, -0.6],
  leafspring: [0, 0, -0.45],
  v4engine: [-0.3, 0, 0],
};

function findByNormalizedKey<T>(map: Record<string, T>, productType: string): T | undefined {
  if (map[productType]) return map[productType];
  const target = normalizeKey(productType);
  const key = Object.keys(map).find((k) => normalizeKey(k) === target);
  return key ? map[key] : undefined;
}

export function getPartAssemblyLayout(
  productType: string,
  partName: string,
): PartAssemblyLayout | undefined {
  const product = findByNormalizedKey(ASSEMBLY_LAYOUTS, productType);
  if (!product) return undefined;
  if (product[partName]) return product[partName];
  const target = normalizeKey(partName);
  const key = Object.keys(product).find((k) => normalizeKey(k) === target);
  return key ? product[key] : undefined;
}

export function getAssemblyLayoutScale(productType: string): number {
  return findByNormalizedKey(ASSEMBLY_LAYOUT_SCALE, productType) ?? 1;
}

export function getAssemblyExplodeScale(productType: string): number {
  return findByNormalizedKey(ASSEMBLY_EXPLODE_SCALE, productType) ?? 1;
}

export function getAssemblyGroupRotation(
  productType: string,
): [number, number, number] | undefined {
  return findByNormalizedKey(ASSEMBLY_GROUP_ROTATION, productType);
}
