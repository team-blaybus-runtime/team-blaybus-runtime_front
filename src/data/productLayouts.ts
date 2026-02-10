import type { AssemblyTransform } from "./assemblyInstances";

type LayoutMap = Record<string, AssemblyTransform | AssemblyTransform[]>;

/* ─── Drone ─── */

const DRONE_LAYOUT: LayoutMap = {
  mainframe: { position: [0, 0, -0.1], rotation: [1.6, Math.PI, 0] },
  mainframemirror: { position: [0, 0, -0.1], rotation: [1.6, Math.PI, 0] },
  beaterdisc: { position: [0.0001, -0.0048, 0.0638], rotation: [0, 4.7, 11] },
  armgear: [
    { position: [0.088, -0.015, 0.082], rotation: [0, 0, 0] },
    { position: [-0.088, -0.015, 0.082], rotation: [0, 0, 0] },
    { position: [-0.1, -0.013, -0.12], rotation: [0, 0, 0] },
    { position: [0.1, -0.013, -0.12], rotation: [0, (Math.PI / 2) * 3, 0] },
  ],
  gearing: [
    { position: [0.08, -0.021, 0.072], rotation: [0, 0, 0] },
    { position: [-0.078, -0.021, 0.07], rotation: [0, Math.PI / 2, 0] },
    { position: [-0.088, -0.02, -0.113], rotation: [0, Math.PI, 0] },
    { position: [0.088, -0.02, -0.113], rotation: [0, (Math.PI / 2) * 3, 0] },
  ],
  impellerblade: [
    { position: [0.088, 0, 0.082], rotation: [0, Math.PI / 3, 0] },
    { position: [-0.088, 0, 0.081], rotation: [0, Math.PI / 3, 0] },
    { position: [-0.1, 0, -0.121], rotation: [0, Math.PI / 3, 0] },
    { position: [0.1, 0, -0.12], rotation: [0, Math.PI / 3, 0] },
  ],
  landingleg: [
    { position: [0.087, -0.004, 0.082], rotation: [0, 10.1, 0] },
    { position: [-0.088, -0.004, 0.08], rotation: [0, 2.43, 0] },
    { position: [0.1, -0.001, -0.12], rotation: [0, 11.45, 0] },
    { position: [-0.1, -0.001, -0.12], rotation: [0, 38.8, 0] },
  ],
  nut: [
    { position: [0.0515, 0.005, 0.037], rotation: [0, 0, 0] },
    { position: [-0.0515, 0.005, 0.037], rotation: [0, Math.PI / 2, 0] },
    { position: [-0.0515, 0.008, -0.094], rotation: [0, Math.PI, 0] },
    { position: [0.0515, 0.008, -0.094], rotation: [0, (Math.PI / 2) * 3, 0] },
  ],
  screw: [
    { position: [0.0515, -0.012, 0.037], rotation: [0, 0, 0] },
    { position: [-0.0515, -0.012, 0.037], rotation: [0, Math.PI / 2, 0] },
    { position: [-0.0515, -0.012, -0.094], rotation: [0, Math.PI, 0] },
    { position: [0.0515, -0.012, -0.094], rotation: [0, (Math.PI / 2) * 3, 0] },
  ],
};

/* ─── Suspension ─── */

const SUSPENSION_LAYOUT: LayoutMap = {
  uppermount: { position: [0, 0, 0], explodedPosition: [0, 0, 0] },
  damperrod: { position: [0, 0.1, 0], explodedPosition: [0, 0.4, 0] },
  coilspring: { position: [0, 0.005, 0], explodedPosition: [0, 0.8, 0] },
  springadjustmentnut: { position: [0, 0.1, 0], explodedPosition: [0, 1.2, 0] },
  locknut: { position: [0, 0.06, 0], explodedPosition: [0, 1.0, 0] },
};

/* ─── V4 Engine ─── */

const V4_ENGINE_LAYOUT: LayoutMap = {
  crankshaft: {
    position: [0, 0.05, 0.3],
    rotation: [-Math.PI / 2, 0, -4.7],
    explodedPosition: [0, -0.3, 0],
  },
  connectingrodcap: [
    { position: [0.04, 0.05, 0.1435], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.15, 0.25] },
    { position: [-0.046, 0.05, 0.031], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.15, 0.1] },
    { position: [-0.046, 0.05, -0.0835], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.15, -0.1] },
    // { position: [0.04, 0.05, -0.1985], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.15, -0.25] },
  ],
  connectingrod: [
    { position: [0.019, 0.25, 0.1435], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.3, 0.25] },
    { position: [-0.025, 0.25, 0.031], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.3, 0.1] },
    { position: [-0.025, 0.25, -0.0835], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.3, -0.1] },
    { position: [0.019, 0.25, -0.1985], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.3, -0.25] },
  ],
  piston: [
    { position: [0.022, 0.223, 0.1435], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.45, 0.25] },
    { position: [-0.027, 0.223, 0.031], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.45, 0.1] },
    { position: [-0.027, 0.223, -0.0835], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.45, -0.1] },
    { position: [0.022, 0.223, -0.1985], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.45, -0.25] },
  ],
  pistonpin: [
    { position: [0.018, 0.25, 0.184], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.6, 0.25] },
    { position: [-0.025, 0.25, 0.072], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.6, 0.1] },
    { position: [-0.025, 0.25, -0.043], rotation: [0, 0, -Math.PI / 30], explodedPosition: [0, 0.6, -0.1] },
    { position: [0.018, 0.25, -0.158], rotation: [0, 0, Math.PI / 30], explodedPosition: [0, 0.6, -0.25] },
  ],
  pistonring: [
    { position: [0.022, 0.223, 0.1435], rotation: [0, 0, Math.PI / 30] },
    { position: [-0.027, 0.223, 0.031], rotation: [0, 0, -Math.PI / 30] },
    { position: [-0.027, 0.223, -0.0835], rotation: [0, 0, -Math.PI / 30] },
    { position: [0.022, 0.223, -0.1985], rotation: [0, 0, Math.PI / 30] },
  ],
  conrodbolt: [
    { position: [-0.045, -0.018, 0.008], rotation: [0, 0, Math.PI / 30] },
    { position: [-0.015, -0.018, 0.008], rotation: [0, 0, Math.PI / 30] },
    { position: [0.015, -0.018, 0.008], rotation: [0, 0, Math.PI / 30] },
    { position: [0.045, -0.018, 0.008], rotation: [0, 0, Math.PI / 30] },
  ],
};

/* ─── Robot Gripper (블렌더 Z-up → Three.js Y-up) ─── */

const ROBOT_GRIPPER_LAYOUT: LayoutMap = {
  baseplate: { position: [0, -0.0025, 0], quaternion: [0, 0.701, 0.701, 0] },
  mountingbracket: { position: [-0.01, 0.003, -0.006], quaternion: [0.014, -0.716, -0.014, 0.698] },
  basegear: { position: [-0.007, -0.005, 0.018], quaternion: [0.076, 0.075, 0.708, 0.698] },
  gearlink1: { position: [-0.014, 0, 0.038], quaternion: [-0.707, 0.680, -0.146, 0.129] },
  gearlink2: { position: [0.014, 0.003, 0.038], quaternion: [-0.635, 0.331, -0.337, -0.627] },
  linkarm: [
    { position: [0.012, 0, 0.072], quaternion: [0.146, 0.155, 0.669, 0.712] },
    { position: [-0.012, 0, 0.072], quaternion: [-0.146, -0.155, 0.669, 0.712] },
  ],
  gripperjaw: [
    { position: [-0.014, -0.003, 0.083], quaternion: [0.564, -0.408, 0.377, 0.611] },
    { position: [0.014, -0.003, 0.083], quaternion: [-0.395, -0.584, -0.591, 0.392] },
  ],
  pin: [
    { position: [0.018, -0.001, 0.085], quaternion: [0, 0, 0.701, 0.713] },
    { position: [-0.018, -0.001, 0.085], quaternion: [0, 0, 0.701, 0.713] },
    { position: [0.027, -0.001, 0.065], quaternion: [0, 0, 0.701, 0.713] },
    { position: [-0.027, -0.001, 0.065], quaternion: [0, 0, 0.701, 0.713] },
    { position: [0.005, 0, 0.057], quaternion: [0, 0, 0.701, 0.713] },
    { position: [-0.005, 0, 0.057], quaternion: [0, 0, 0.701, 0.713] },
    { position: [0.014, -0.002, 0.038], quaternion: [0, 0, 0.701, 0.713] },
    { position: [-0.014, -0.002, 0.038], quaternion: [0, 0, 0.701, 0.713] },
    { position: [0.006, -0.001, 0.003], quaternion: [0, 0, 0.701, 0.713] },
    { position: [-0.006, -0.001, 0.003], quaternion: [0, 0, 0.701, 0.713] },
  ],
};

/* ─── Robot Arm ─── */

const ROBOT_ARM_LAYOUT: LayoutMap = {
  base: { position: [0, 0, 0] },
  shoulderjoint: { position: [0, 0.1, 0] },
  upperarmlink: { position: [0, 0.26, 0.15], rotation: [-1, Math.PI, -Math.PI / 2] },
  elbowjoint: { position: [0, 0.5, -0.2] },
  forearmlink: { position: [0, 0.5, 0.1], explodedPosition: [0, 1.2, 0.5] },
  wristjoint: { position: [0, 0.47, 0.24], rotation: [-Math.PI / 4, 0, 0], explodedPosition: [0, 1.5, 1.0] },
  endeffectorinterface: { position: [0, 0.43, 0.28], rotation: [Math.PI / 4, 0, 0], explodedPosition: [0, 1.8, 1.4] },
  gripper: [
    { position: [-0.045, 0.35, 0.34], rotation: [-Math.PI / 4, 0, -0.5] },
    { position: [0.045, 0.36, 0.35], rotation: [-Math.PI / 4, -Math.PI, -0.5] },
  ],
};

/* ─── Leaf Spring ─── */

const LEAF_SPRING_LAYOUT: LayoutMap = {
  leaflayer: { position: [0, 0, 0] },
  clampcenter: { position: [0, 0, 0] },
  clampprimary: { position: [0, 0, 0] },
  clampsecondary: { position: [0, 0, 0] },
  support: { position: [0, 0, 0] },
  supportrubber: { position: [0, 0, 0] },
  supportrubber60mm: { position: [0, 0, 0] },
  supportchassis: { position: [0, 0, 0] },
  supportchassisrigid: { position: [0, 0, 0] },
};

/* ─── Machine Vice (블렌더 Z-up → Three.js Y-up) ─── */

const MACHINE_VICE_LAYOUT: LayoutMap = {
  visebody: { position: [0, 0, 0] },
  guidehousing: { position: [-0.002, 0, 0], quaternion: [0.705507, 0, 0, 0.708703] },
  fixedjaw: { position: [-0.0275, -0.001, 0.0651], quaternion: [0, 0.709721, 0, 0.704483] },
  movablejaw: { position: [0.0822, 0.0349, 0.0636], quaternion: [0, 0.711771, 0, 0.702411] },
  spindlehousing: { position: [0.1374, 0, 0.0448], quaternion: [0, 0.70116, 0, 0.713004] },
  clampingjaw: [
    { position: [0.0379, 0.0345, -0.0112], quaternion: [0, -0.701184, 0, 0.71298] },
    { position: [-0.011, 0.0343, 0.0656], quaternion: [0, 0.705922, 0, 0.708289] },
  ],
  guiderail: { position: [0, 0, 0] },
  trapezoidalspindle: { position: [0.215, 0.0437, 0.0286], quaternion: [-0.01357, 0.701748, -0.011102, 0.712209] },
  baseplate: { position: [0.1577, 0, 0.0648], quaternion: [0.00292, -0.708697, 0.705501, 0.002934] },
  pressuresleeve: { position: [0, 0, 0] },
};

/* ─── 제품별 매핑 ─── */

export const PRODUCT_LAYOUTS: Record<string, LayoutMap> = {
  suspension: SUSPENSION_LAYOUT,
  drone: DRONE_LAYOUT,
  v4engine: V4_ENGINE_LAYOUT,
  robotgripper: ROBOT_GRIPPER_LAYOUT,
  robotarm: ROBOT_ARM_LAYOUT,
  leafspring: LEAF_SPRING_LAYOUT,
  machinevice: MACHINE_VICE_LAYOUT,
};

export const EXPLODE_OFFSET_BY_PRODUCT: Record<string, number> = {
  drone: 0.25,
  v4engine: 0.2,
  robotgripper: 0.15,
  robotarm: 0.2,
  leafspring: 0.1,
  machinevice: 0.2,
  suspension: 0.3,
};

export const INSTANCE_SCALE_BY_PRODUCT: Record<string, number> = {};

/* ─── 조립도 전체 회전 ─── */

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/[\s-_]/g, "");

const ASSEMBLY_GROUP_ROTATION: Record<string, [number, number, number]> = {
  suspension: [0, 0, -0.6],
  leafspring: [0, 0, -0.45],
  v4engine: [-0.3, 0, 0],
};

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
