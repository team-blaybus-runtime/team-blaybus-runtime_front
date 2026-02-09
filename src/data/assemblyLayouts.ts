/**
 * 제품별 조립도 레이아웃 (assembled/exploded 위치).
 * partName으로 API 부품과 매칭하여 사용.
 */
export interface PartAssemblyLayout {
  assembled: [number, number, number];
  exploded: [number, number, number];
}

export type ProductAssemblyLayout = Record<string, PartAssemblyLayout>;

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
    BASE: {
      assembled: [0, 0, 0],
      exploded: [0, 0, 0],
    },
    ROD: {
      assembled: [0, 0.1, 0],
      exploded: [0, 0.4, 0],
    },
    SPRING: {
      assembled: [0, 0.02, 0],
      exploded: [0, 0.8, 0],
    },
    NUT: {
      assembled: [0, 0.12, 0],
      exploded: [0, 1.2, 0],
    },
    NIT: {
      assembled: [0, 0.06, 0],
      exploded: [0, 1.0, 0],
    },
  },
  서스펜션: {
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
    BASE: {
      assembled: [0, 0, 0],
      exploded: [0, 0, 0],
    },
    ROD: {
      assembled: [0, 0.1, 0],
      exploded: [0, 0.4, 0],
    },
    SPRING: {
      assembled: [0, 0.02, 0],
      exploded: [0, 0.8, 0],
    },
    NUT: {
      assembled: [0, 0.12, 0],
      exploded: [0, 1.2, 0],
    },
    NIT: {
      assembled: [0, 0.06, 0],
      exploded: [0, 1.0, 0],
    },
  },
};

/** 씬 스케일 (조립도 위치 단위 보정) */
export const ASSEMBLY_LAYOUT_SCALE: Record<string, number> = {
  Suspension: 1,
  서스펜션: 1,
};

/** 분해 거리만 키우고 싶을 때 사용 */
export const ASSEMBLY_EXPLODE_SCALE: Record<string, number> = {
  Suspension: 300,
  서스펜션: 300,
};

/** 조립도 전체 회전 (참고 이미지 각도 보정) */
export const ASSEMBLY_GROUP_ROTATION: Record<
  string,
  [number, number, number]
> = {
  Suspension: [0, 0, -0.6],
  서스펜션: [0, 0, -0.6],
  "Leaf Spring": [0, 0, -0.45],
  "LeafSpring": [0, 0, -0.45],
  "Leaf_Spring": [0, 0, -0.45],
  "leaf spring": [0, 0, -0.45],
  "leafspring": [0, 0, -0.45],
  V4_Engine: [-0.3, 0, 0],
  "V4 Engine": [-0.3, 0, 0],
  v4engine: [-0.3, 0, 0],
};

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/[\s-_]/g, "");

function getProductLayout(productType: string): ProductAssemblyLayout | undefined {
  if (ASSEMBLY_LAYOUTS[productType]) return ASSEMBLY_LAYOUTS[productType];
  const target = normalizeKey(productType);
  const key = Object.keys(ASSEMBLY_LAYOUTS).find(
    (k) => normalizeKey(k) === target,
  );
  return key ? ASSEMBLY_LAYOUTS[key] : undefined;
}

function getProductScale(productType: string): number {
  if (ASSEMBLY_LAYOUT_SCALE[productType] != null) {
    return ASSEMBLY_LAYOUT_SCALE[productType];
  }
  const target = normalizeKey(productType);
  const key = Object.keys(ASSEMBLY_LAYOUT_SCALE).find(
    (k) => normalizeKey(k) === target,
  );
  return key ? ASSEMBLY_LAYOUT_SCALE[key] : 1;
}

export function getPartAssemblyLayout(
  productType: string,
  partName: string,
): PartAssemblyLayout | undefined {
  const product = getProductLayout(productType);
  if (!product) return undefined;
  const direct =
    product[partName] ??
    product[partName.toUpperCase()] ??
    product[partName.trim()] ??
    product[partName.trim().toUpperCase()];
  if (direct) return direct;
  const target = normalizeKey(partName);
  const key = Object.keys(product).find((k) => normalizeKey(k) === target);
  return key ? product[key] : undefined;
}

export function getAssemblyLayoutScale(productType: string): number {
  return getProductScale(productType);
}

export function getAssemblyExplodeScale(productType: string): number {
  const direct = ASSEMBLY_EXPLODE_SCALE[productType];
  if (direct != null) return direct;
  const target = normalizeKey(productType);
  const key = Object.keys(ASSEMBLY_EXPLODE_SCALE).find(
    (k) => normalizeKey(k) === target,
  );
  return key ? ASSEMBLY_EXPLODE_SCALE[key] : 1;
}

export function getAssemblyGroupRotation(
  productType: string,
): [number, number, number] | undefined {
  const direct = ASSEMBLY_GROUP_ROTATION[productType];
  if (direct) return direct;
  const target = normalizeKey(productType);
  const key = Object.keys(ASSEMBLY_GROUP_ROTATION).find(
    (k) => normalizeKey(k) === target,
  );
  return key ? ASSEMBLY_GROUP_ROTATION[key] : undefined;
}
