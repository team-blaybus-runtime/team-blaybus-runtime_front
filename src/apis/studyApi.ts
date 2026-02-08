import { Api } from "@/apis/baseApi";

// ===== API 응답 타입 =====

export interface ViewInfo {
  partId: number;
  position: [number, number, number];
  geometry: [number, number, number];
  color: string;
  roughnessMultiplier: number;
  metalnessMultiplier: number;
  envMapMultiplier: number;
  roughness: number;
  metalness: number;
  envMapIntensity: number;
}

export interface UserStudyHistory {
  userStudyHisId: number;
  title: string;
  updatedAt: string;
  viewInfo: ViewInfo;
  ProductTypeDesc: string;
  productImageUrl: string;
}

// ===== 기존 프론트 타입 (Mock 용) =====

export interface StudyObject {
  objectId: string;
  objectName: string;
  thumbnailUrl: string;
}

export interface StudyComponent {
  componentId: string;
  componentName: string;
  glbUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

export interface StudyObjectDetail {
  object: StudyObject;
  components: StudyComponent[];
}

// ===== Mock 데이터 (백엔드 완성 전까지 사용) =====
const MOCK_DATA: Record<string, StudyObjectDetail> = {
  drone: {
    object: {
      objectId: "drone",
      objectName: "Drone",
      thumbnailUrl: "/3D Asset/Drone/조립도1.png",
    },
    components: [
      { componentId: "drone-1", componentName: "Main frame", glbUrl: "/3D Asset/Drone/Main frame.glb" },
      { componentId: "drone-2", componentName: "Main frame MIR", glbUrl: "/3D Asset/Drone/Main frame_MIR.glb" },
      { componentId: "drone-3", componentName: "Arm gear", glbUrl: "/3D Asset/Drone/Arm gear.glb" },
      { componentId: "drone-4", componentName: "Beater disc", glbUrl: "/3D Asset/Drone/Beater disc.glb" },
      { componentId: "drone-5", componentName: "Gearing", glbUrl: "/3D Asset/Drone/Gearing.glb" },
      { componentId: "drone-6", componentName: "Impellar Blade", glbUrl: "/3D Asset/Drone/Impellar Blade.glb" },
      { componentId: "drone-7", componentName: "Leg", glbUrl: "/3D Asset/Drone/Leg.glb" },
      { componentId: "drone-8", componentName: "Nut", glbUrl: "/3D Asset/Drone/Nut.glb" },
      { componentId: "drone-9", componentName: "Screw", glbUrl: "/3D Asset/Drone/Screw.glb" },
      { componentId: "drone-10", componentName: "xyz", glbUrl: "/3D Asset/Drone/xyz.glb" },
    ],
  },
  "machine-vice": {
    object: {
      objectId: "machine-vice",
      objectName: "Machine Vice",
      thumbnailUrl: "/3D Asset/Machine Vice/공작 기계 바이스.jpg",
    },
    components: [
      { componentId: "mv-1", componentName: "Fuhrung", glbUrl: "/3D Asset/Machine Vice/Part1 Fuhrung.glb" },
      { componentId: "mv-2", componentName: "Part1", glbUrl: "/3D Asset/Machine Vice/Part1.glb" },
      { componentId: "mv-3", componentName: "Feste Backe", glbUrl: "/3D Asset/Machine Vice/Part2 Feste Backe.glb" },
      { componentId: "mv-4", componentName: "Lose Backe", glbUrl: "/3D Asset/Machine Vice/Part3-lose backe.glb" },
      { componentId: "mv-5", componentName: "Spindelsockel", glbUrl: "/3D Asset/Machine Vice/Part4 spindelsockel.glb" },
      { componentId: "mv-6", componentName: "Spannbacke", glbUrl: "/3D Asset/Machine Vice/Part5-Spannbacke.glb" },
      { componentId: "mv-7", componentName: "Fuhrungschiene", glbUrl: "/3D Asset/Machine Vice/Part6-fuhrungschiene.glb" },
      { componentId: "mv-8", componentName: "TrapezSpindel", glbUrl: "/3D Asset/Machine Vice/Part7-TrapezSpindel.glb" },
      { componentId: "mv-9", componentName: "Grundplatte", glbUrl: "/3D Asset/Machine Vice/Part8-grundplatte.glb" },
      { componentId: "mv-10", componentName: "Druckhulse", glbUrl: "/3D Asset/Machine Vice/Part9-Druckhulse.glb" },
    ],
  },
  suspension: {
    object: {
      objectId: "suspension",
      objectName: "Suspension",
      thumbnailUrl: "/3D Asset/Suspension/서스펜션 조립도.png",
    },
    components: [
      { componentId: "sus-1", componentName: "BASE", glbUrl: "/3D Asset/Suspension/BASE.glb" },
      { componentId: "sus-2", componentName: "NIT", glbUrl: "/3D Asset/Suspension/NIT.glb" },
      { componentId: "sus-3", componentName: "NUT", glbUrl: "/3D Asset/Suspension/NUT.glb" },
      { componentId: "sus-4", componentName: "ROD", glbUrl: "/3D Asset/Suspension/ROD.glb" },
      { componentId: "sus-5", componentName: "SPRING", glbUrl: "/3D Asset/Suspension/SPRING.glb" },
    ],
  },
  "robot-arm": {
    object: {
      objectId: "robot-arm",
      objectName: "Robot Arm",
      thumbnailUrl: "/3D Asset/Robot Arm/로보팔 조립도.png",
    },
    components: [
      { componentId: "ra-1", componentName: "Base", glbUrl: "/3D Asset/Robot Arm/base.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/base.png", description: "로봇 암 전체를 지지하며, 상부 관절이 회전할 수 있도록 안정적인 기준점을 제공합니다." },
      { componentId: "ra-2", componentName: "Base Joint", glbUrl: "/3D Asset/Robot Arm/Part2.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part2.png", description: "로봇 암을 좌우로 회전시켜 작업 범위를 넓혀주는 첫 번째 회전 관절입니다." },
      { componentId: "ra-3", componentName: "Shoulder Joint", glbUrl: "/3D Asset/Robot Arm/Part3.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part3.png", description: "팔을 위아래로 들어 올리며 로봇 암의 높이와 기본 자세를 결정합니다." },
      { componentId: "ra-4", componentName: "Upper Arm Link", glbUrl: "/3D Asset/Robot Arm/Part4.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part4.png", description: "어깨 관절과 팔꿈치 관절을 연결하는 구조물로, 하중을 전달하는 역할을 합니다." },
      { componentId: "ra-5", componentName: "Elbow Joint", glbUrl: "/3D Asset/Robot Arm/Part5.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part5.png", description: "팔의 중간 부분을 접거나 펼 수 있게 해주는 관절로, 도달 범위를 조절합니다." },
      { componentId: "ra-6", componentName: "Forearm Link", glbUrl: "/3D Asset/Robot Arm/Part6.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part6.png", description: "팔꿈치와 손목을 연결하는 하부 구조물로, 정밀한 위치 제어를 지원합니다." },
      { componentId: "ra-7", componentName: "Wrist Joint", glbUrl: "/3D Asset/Robot Arm/Part7.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part7.png", description: "손목 부분의 회전과 기울임을 담당하며, 끝단 도구의 방향을 조절합니다." },
      { componentId: "ra-8", componentName: "End Effector Mount", glbUrl: "/3D Asset/Robot Arm/Part8.glb", thumbnailUrl: "/3D Asset/Robot Arm/thumbnails/part8.png", description: "그리퍼, 용접기 등 다양한 도구를 장착할 수 있는 끝단 연결부입니다." },
    ],
  },
  "robot-gripper": {
    object: {
      objectId: "robot-gripper",
      objectName: "Robot Gripper",
      thumbnailUrl: "/3D Asset/Robot Gripper/로봇집게 조립도.png",
    },
    components: [
      { componentId: "rg-1", componentName: "Base Gear", glbUrl: "/3D Asset/Robot Gripper/Base Gear.glb" },
      { componentId: "rg-2", componentName: "Base Mounting bracket", glbUrl: "/3D Asset/Robot Gripper/Base Mounting bracket.glb" },
      { componentId: "rg-3", componentName: "Base Plate", glbUrl: "/3D Asset/Robot Gripper/Base Plate.glb" },
      { componentId: "rg-4", componentName: "Gear link 1", glbUrl: "/3D Asset/Robot Gripper/Gear link 1.glb" },
      { componentId: "rg-5", componentName: "Gear link 2", glbUrl: "/3D Asset/Robot Gripper/Gear link 2.glb" },
      { componentId: "rg-6", componentName: "Gripper", glbUrl: "/3D Asset/Robot Gripper/Gripper.glb" },
      { componentId: "rg-7", componentName: "Link", glbUrl: "/3D Asset/Robot Gripper/Link.glb" },
      { componentId: "rg-8", componentName: "Pin", glbUrl: "/3D Asset/Robot Gripper/Pin.glb" },
    ],
  },
  "leaf-spring": {
    object: {
      objectId: "leaf-spring",
      objectName: "Leaf Spring",
      thumbnailUrl: "/3D Asset/Leaf Spring/판스프링 조립도.png",
    },
    components: [
      { componentId: "ls-1", componentName: "Clamp-Center", glbUrl: "/3D Asset/Leaf Spring/Clamp-Center.glb" },
      { componentId: "ls-2", componentName: "Clamp-Primary", glbUrl: "/3D Asset/Leaf Spring/Clamp-Primary.glb" },
      { componentId: "ls-3", componentName: "Clamp-Secondary", glbUrl: "/3D Asset/Leaf Spring/Clamp-Secondary.glb" },
      { componentId: "ls-4", componentName: "Leaf-Layer", glbUrl: "/3D Asset/Leaf Spring/Leaf-Layer.glb" },
      { componentId: "ls-5", componentName: "Support", glbUrl: "/3D Asset/Leaf Spring/Support.glb" },
      { componentId: "ls-6", componentName: "Support-Chassis Rigid", glbUrl: "/3D Asset/Leaf Spring/Support-Chassis Rigid.glb" },
      { componentId: "ls-7", componentName: "Support-Chassis", glbUrl: "/3D Asset/Leaf Spring/Support-Chassis.glb" },
      { componentId: "ls-8", componentName: "Support-Rubber 60mm", glbUrl: "/3D Asset/Leaf Spring/Support-Rubber 60mm.glb" },
      { componentId: "ls-9", componentName: "Support-Rubber", glbUrl: "/3D Asset/Leaf Spring/Support-Rubber.glb" },
    ],
  },
  "v4-engine": {
    object: {
      objectId: "v4-engine",
      objectName: "V4 Engine",
      thumbnailUrl: "/3D Asset/V4_Engine/V4실린더 엔진 조립도.png",
    },
    components: [
      { componentId: "v4-1", componentName: "Piston", glbUrl: "/3D Asset/V4_Engine/Piston.glb" },
      { componentId: "v4-2", componentName: "Piston Ring", glbUrl: "/3D Asset/V4_Engine/Piston Ring.glb" },
      { componentId: "v4-3", componentName: "Piston Pin", glbUrl: "/3D Asset/V4_Engine/Piston Pin.glb" },
      { componentId: "v4-4", componentName: "Crankshaft", glbUrl: "/3D Asset/V4_Engine/Crankshaft.glb" },
      { componentId: "v4-5", componentName: "Conrod Bolt", glbUrl: "/3D Asset/V4_Engine/Conrod Bolt.glb" },
      { componentId: "v4-6", componentName: "Connecting Rod", glbUrl: "/3D Asset/V4_Engine/Connecting Rod.glb" },
      { componentId: "v4-7", componentName: "Connecting Rod Cap", glbUrl: "/3D Asset/V4_Engine/Connecting Rod Cap.glb" },
    ],
  },
};

// ===== API 요청 타입 =====

export interface CreateStudyHistoryRequest {
  productType: string;
  title: string;
  viewInfo: ViewInfo;
}

// ===== API 함수 =====

/**
 * 사용자 학습 이력 조회
 * GET /user-study-histories
 */
export async function fetchUserStudyHistories(): Promise<UserStudyHistory[]> {
  const { data } = await Api.get<UserStudyHistory[]>("/user-study-histories");
  return data;
}

/**
 * 사용자 학습 이력 생성
 * POST /user-study-histories
 */
export async function createUserStudyHistory(
  body: CreateStudyHistoryRequest,
): Promise<UserStudyHistory> {
  const { data } = await Api.post<UserStudyHistory>("/user-study-histories", body);
  return data;
}

/**
 * 오브젝트 상세 정보 + 컴포넌트 목록 조회
 * 백엔드 완성 후: GET /api/objects/:objectId → { object, components }
 */
export async function fetchStudyObject(objectId: string): Promise<StudyObjectDetail | null> {
  // TODO: 백엔드 완성 후 아래 주석 해제
  // const { data } = await Api.get<StudyObjectDetail>(`/objects/${objectId}`);
  // return data;

  // Mock: 로컬 데이터 반환
  return MOCK_DATA[objectId] ?? null;
}

/**
 * 전체 오브젝트 목록 조회
 * 백엔드 완성 후: GET /api/objects → StudyObject[]
 */
export async function fetchStudyObjects(): Promise<StudyObject[]> {
  // TODO: 백엔드 완성 후 아래 주석 해제
  // const { data } = await Api.get<StudyObject[]>("/objects");
  // return data;

  return Object.values(MOCK_DATA).map((d) => d.object);
}
