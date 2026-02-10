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
  camera?: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  renderSettings?: {
    bloom: { intensity: number; threshold: number; smoothing: number };
    ao: { radius: number; intensity: number };
    lighting: { keyLightIntensity: number; ambientIntensity: number };
  };
}

export interface UserStudyHistory {
  userStudyHisId: number;
  title: string;
  updatedAt: string;
  viewInfo: ViewInfo;
  ProductTypeDesc: string;
  productImageUrl: string;
}

/** 부품별 조립도용 조립/분해 위치 (제품 레이아웃 config에서 매칭) */
export interface AssemblyLayoutPart {
  assembled: [number, number, number];
  exploded: [number, number, number];
}

export interface StudyComponent {
  componentId: string;
  componentName: string;
  glbUrl: string;
  thumbnailUrl?: string;
  description?: string;
  /** 조립도 전용: 이 부품의 배치/분해 설정 (있으면 조립도 슬라이더에 반영) */
  assemblyLayout?: AssemblyLayoutPart;
}

// ===== API 요청 타입 =====

export interface CreateStudyHistoryRequest {
  productTypeDesc: string;
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
 * 사용자 학습 이력 생성 및 수정
 * POST /user-study-histories
 */
/**
 * 사용자 학습 이력 단건 조회 (목록에서 필터)
 */
export async function fetchUserStudyHistory(
  historyId: number,
): Promise<UserStudyHistory | null> {
  const list = await fetchUserStudyHistories();
  return list.find((h) => h.userStudyHisId === historyId) ?? null;
}

/**
 * 사용자 학습 이력 생성 및 수정
 * POST /user-study-histories
 */
export async function saveUserStudyHistory(
  body: CreateStudyHistoryRequest,
): Promise<UserStudyHistory> {
  const { data } = await Api.post<UserStudyHistory>(
    "/user-study-histories",
    body,
  );
  return data;
}
