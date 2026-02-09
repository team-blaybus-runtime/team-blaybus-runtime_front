import type { StudyComponent } from "@/apis/study";

export type AssemblyPosition = [number, number, number];
export type AssemblyRotation = [number, number, number];
export interface AssemblyTransform {
  position: AssemblyPosition;
  rotation?: AssemblyRotation;
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

const DEG180 = Math.PI;

const DRONE_LAYOUT: Record<string, AssemblyTransform | AssemblyTransform[]> = {
  mainframe: { position: [0, 0, -0.1], rotation: [1.6, DEG180, 0] },
  mainframemir: { position: [0, 0, -0.1], rotation: [1.6, DEG180, 0] },
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
  impellarblade: [
    { position: [0.088, 0, 0.082], rotation: [0, Math.PI / 3, 0] },
    { position: [-0.088, 0, 0.081], rotation: [0, Math.PI / 3, 0] },
    { position: [-0.1, 0, -0.121], rotation: [0, Math.PI / 3, 0] },
    { position: [0.1, 0, -0.12], rotation: [0, Math.PI / 3, 0] },
  ],
  leg: [
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

const SUSPENSION_LAYOUT: Record<string, AssemblyTransform> = {
  base: { position: [0, 0, 0], explodedPosition: [0, 0, 0] },
  rod: { position: [0, 0.1, 0], explodedPosition: [0, 0.4, 0] },
  spring: { position: [0, 0.005, 0], explodedPosition: [0, 0.8, 0] },
  nut: { position: [0, 0.1, 0], explodedPosition: [0, 1.2, 0] },
  nit: { position: [0, 0.06, 0], explodedPosition: [0, 1.0, 0] },
};

const V4_ENGINE_LAYOUT: Record<string, AssemblyTransform | AssemblyTransform[]> =
{
  crankshaft: {
    position: [0, 0.05, 0.3],
    rotation: [-Math.PI / 2, 0, -4.7],
    explodedPosition: [0, -0.3, 0],
  },
  connectingrodcap: [
    {
      position: [0.04, 0.05, 0.1435],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.15, 0.25],
    },
    {
      position: [-0.046, 0.05, 0.031],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.15, 0.1],
    },
    {
      position: [-0.046, 0.05, -0.0835],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.15, -0.1],
    },
    {
      position: [0.04, 0.05, -0.1985],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.15, -0.25],
    },
  ],
  connectingrod: [
    {
      position: [0.019, 0.25, 0.1435],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.3, 0.25],
    },
    {
      position: [-0.025, 0.25, 0.031],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.3, 0.1],
    },
    {
      position: [-0.025, 0.25, -0.0835],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.3, -0.1],
    },
    {
      position: [0.019, 0.25, -0.1985],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.3, -0.25],
    },
  ],
  piston: [
    {
      position: [0.022, 0.223, 0.1435],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.45, 0.25],
    },
    {
      position: [-0.027, 0.223, 0.031],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.45, 0.1],
    },
    {
      position: [-0.027, 0.223, -0.0835],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.45, -0.1],
    },
    {
      position: [0.022, 0.223, -0.1985],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.45, -0.25],
    },
  ],
  pistonpin: [
    {
      position: [0.018, 0.25, 0.184],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.6, 0.25],
    },
    {
      position: [-0.025, 0.25, 0.072],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.6, 0.1],
    },
    {
      position: [-0.025, 0.25, -0.043],
      rotation: [0, 0, -Math.PI / 30],
      explodedPosition: [0, 0.6, -0.1],
    },
    {
      position: [0.018, 0.25, -0.158],
      rotation: [0, 0, Math.PI / 30],
      explodedPosition: [0, 0.6, -0.25],
    },
  ],
  // 피스톤 링은 피스톤과 같은 좌표로 겹쳐 배치
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

const ROBOT_GRIPPER_LAYOUT: Record<string, AssemblyTransform | AssemblyTransform[]> = {
  // 조립도2 정면 뷰 기준 배치
  baseplate: { position: [0, 0.1, 0], rotation: [0, 0, 0] },
  basemountingbracket: { position: [0, 0.12, 0], rotation: [0, 0, 0] },
  basegear: { position: [0, 0.08, 0], rotation: [0, 0, 0] },
  gearlink1: { position: [-0.055, 0.025, 0], rotation: [0, 0, 0] }, // 빨강 기어
  gearlink2: { position: [0.055, 0.025, 0], rotation: [0, 0, 0] }, // 노랑 기어
  link: [
    { position: [-0.02, -0.02, 0], rotation: [0, 0, 0] },
    { position: [0.02, -0.02, 0], rotation: [0, 0, 0] },
  ],
  gripper: [
    { position: [-0.03, -0.12, 0], rotation: [0, 0, 0] },
    { position: [0.03, -0.12, 0], rotation: [0, Math.PI, 0] },
  ],
  pin: { position: [0, 0, 0], rotation: [0, 0, 0] },
};

const ROBOT_ARM_LAYOUT: Record<string, AssemblyTransform> = {
  base: { position: [0, 0, 0] },
  basejoint: { position: [0, 0.43, 0.28], rotation: [Math.PI / 4, 0, 0] },
  shoulderjoint: { position: [0, 0.1, 0] },
  upperarmlink: { position: [0, 0.26, 0.15], rotation: [-1, Math.PI, -Math.PI / 2] },
  elbowjoint: { position: [0, 0.5, -0.2] },
  forearmlink: { position: [0, 0.47, 0.24], rotation: [-Math.PI / 4, 0, 0] },
  wristjoint: { position: [0, 0.5, 0.1] },
  endeffectormount: { position: [0, 0.5, 0.1] },
};

const LEAF_SPRING_LAYOUT: Record<string, AssemblyTransform> = {
  // Leaf Spring은 각 GLB가 동일 좌표계로 export되어 있는 것으로 가정
  // → 모두 원점에 두어 조립 상태가 맞도록 배치
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

const MACHINE_VICE_LAYOUT: Record<string, AssemblyTransform> = {
  visebody: { position: [0, 0, 0] },
  baseplate: { position: [0, -0.08, 0] },
  fixedjaw: { position: [0, 0.1, 0.2] },
  movablejaw: { position: [0, 0.1, -0.2] },
  trapezoidalspindle: { position: [0, 0.05, -0.4] },
  guidehousing: { position: [0, 0.02, 0] },
  guiderail: { position: [0, 0.02, -0.1] },
  spindlehousing: { position: [0, 0.03, -0.15] },
  clampjaw: { position: [0, 0.12, 0.25] },
  pressuresleeve: { position: [0, 0.06, -0.3] },
};

const PRODUCT_LAYOUTS: Record<
  string,
  Record<string, AssemblyTransform | AssemblyTransform[]>
> = {
  suspension: SUSPENSION_LAYOUT,
  drone: DRONE_LAYOUT,
  v4engine: V4_ENGINE_LAYOUT,
  robotgripper: ROBOT_GRIPPER_LAYOUT,
  robotarm: ROBOT_ARM_LAYOUT,
  leafspring: LEAF_SPRING_LAYOUT,
  machinevice: MACHINE_VICE_LAYOUT,
};

const EXPLODE_OFFSET_BY_PRODUCT: Record<string, number> = {
  drone: 0.25,
  v4engine: 0.2,
  robotgripper: 0.15,
  robotarm: 0.2,
  leafspring: 0.1,
  machinevice: 0.2,
  suspension: 0.3,
};

const INSTANCE_SCALE_BY_PRODUCT: Record<string, number> = {};

function scaleTransform(
  productKey: string,
  transform: AssemblyTransform,
  scale: number,
): AssemblyTransform {
  const mapped = transform.position;
  if (scale === 1) {
    return { ...transform, position: mapped };
  }
  return {
    ...transform,
    position: [mapped[0] * scale, mapped[1] * scale, mapped[2] * scale],
    explodedPosition: transform.explodedPosition
      ? [
        transform.explodedPosition[0] * scale,
        transform.explodedPosition[1] * scale,
        transform.explodedPosition[2] * scale,
      ]
      : undefined,
  };
}


const NAME_ALIASES: Record<string, Record<string, string>> = {
  suspension: {
    springadjustmentnut: "nut",
    locknut: "nit",
    uppermount: "base",
    coilspring: "spring",
    damperrod: "rod",
  },
  drone: {
    "mainframe(mirror)": "mainframemir",
    mainframemirror: "mainframemir",
    mainframe: "mainframe",
    beaterdisc: "beaterdisc",
    armgear: "armgear",
    gearing: "gearing",
    impellerblade: "impellarblade",
    impellarblade: "impellarblade",
    landingleg: "leg",
    nut: "nut",
    screw: "screw",
  },
  v4engine: {
    crankshaft: "crankshaft",
    connectingrodcap: "connectingrodcap",
    connectingrod: "connectingrod",
    piston: "piston",
    pistonpin: "pistonpin",
    pistonring: "pistonring",
    conrodbolt: "conrodbolt",
  },
  robotgripper: {
    baseplate: "baseplate",
    basemountingbracket: "basemountingbracket",
    basegear: "basegear",
    gearlink1: "gearlink1",
    gearlink2: "gearlink2",
    linkarm: "link",
    gripperjaw: "gripper",
    pin: "pin",
  },
  robotarm: {
    base: "base",
    basejoint: "basejoint",
    shoulderjoint: "shoulderjoint",
    upperarmlink: "upperarmlink",
    elbowjoint: "elbowjoint",
    forearmlink: "forearmlink",
    wristjoint: "wristjoint",
    endeffectormount: "endeffectormount",
    gripper: "endeffectormount",
  },
  leafspring: {
    leaflayer: "leaflayer",
    support: "support",
    clampprimary: "clampprimary",
    clampsecondary: "clampsecondary",
    clampcenter: "clampcenter",
    supportrubber: "supportrubber",
    supportrubber60mm: "supportrubber60mm",
    supportchassis: "supportchassis",
    supportchassisrigid: "supportchassisrigid",
  },
  machinevice: {
    visebody: "visebody",
    baseplate: "baseplate",
    fixedjaw: "fixedjaw",
    movablejaw: "movablejaw",
    trapezoidalspindle: "trapezoidalspindle",
    guidehousing: "guidehousing",
    guiderail: "guiderail",
    spindlehousing: "spindlehousing",
    clampingjaw: "clampjaw",
    clampjaw: "clampjaw",
    pressuresleeve: "pressuresleeve",
  },
};

function resolveLayoutKey(productKey: string, name: string): string {
  const normalized = normalizeKey(name);
  const aliasMap = NAME_ALIASES[productKey];
  return aliasMap?.[normalized] ?? normalized;
}

export function getAssemblyInstances(
  objectId: string,
  components: StudyComponent[],
): AssemblyInstance[] {
  const productKey = normalizeKey(objectId);
  const layoutMap = PRODUCT_LAYOUTS[productKey] ?? {};
  const instanceScale = INSTANCE_SCALE_BY_PRODUCT[productKey] ?? 1;

  return components.flatMap((component, index) => {
    const nameKey = resolveLayoutKey(productKey, component.componentName);
    const transform = layoutMap[nameKey];

    if (Array.isArray(transform)) {
      return transform.map((item, instanceIndex) => ({
        key: `${component.componentId}-${instanceIndex}`,
        component,
        transform: scaleTransform(productKey, item, instanceScale),
        instanceIndex,
      }));
    }

    if (transform) {
      return [
        {
          key: component.componentId,
          component,
          transform: scaleTransform(productKey, transform, instanceScale),
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
  const productKey = normalizeKey(objectId);
  return EXPLODE_OFFSET_BY_PRODUCT[productKey] ?? 0.2;
}

