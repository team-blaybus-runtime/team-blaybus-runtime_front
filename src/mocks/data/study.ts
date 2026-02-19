import type { UserStudyHistory, ViewInfo } from "@/apis/study";

const defaultViewInfo: ViewInfo = {
  partId: 1,
  position: [0, 0, 0],
  geometry: [1, 1, 1],
  color: "#888888",
  roughnessMultiplier: 1,
  metalnessMultiplier: 1,
  envMapMultiplier: 1,
  roughness: 0.5,
  metalness: 0.5,
  envMapIntensity: 1,
};

const initialHistories: UserStudyHistory[] = [
  {
    userStudyHisId: 1,
    title: "드론 구조 학습",
    updatedAt: "2025-01-20T10:00:00Z",
    ProductTypeDesc: "Drone",
    productImageUrl: "/3D Asset/Drone/조립도1.png",
    viewInfo: { ...defaultViewInfo, partId: 1 },
  },
  {
    userStudyHisId: 2,
    title: "V4 엔진 학습",
    updatedAt: "2025-01-21T11:00:00Z",
    ProductTypeDesc: "V4 Engine",
    productImageUrl: "/3D Asset/V4_Engine/V4실린더 엔진 조립도.png",
    viewInfo: { ...defaultViewInfo, partId: 2 },
  },
  {
    userStudyHisId: 3,
    title: "서스펜션 학습",
    updatedAt: "2025-01-22T14:00:00Z",
    ProductTypeDesc: "Suspension",
    productImageUrl: "/3D Asset/Suspension/서스펜션 조립도.png",
    viewInfo: { ...defaultViewInfo, partId: 3 },
  },
  {
    userStudyHisId: 4,
    title: "공작 기계 바이스 학습",
    updatedAt: "2025-01-23T09:00:00Z",
    ProductTypeDesc: "Machine Vice",
    productImageUrl: "/3D Asset/Machine Vice/공작 기계 바이스.jpg",
    viewInfo: { ...defaultViewInfo, partId: 4 },
  },
  {
    userStudyHisId: 5,
    title: "판스프링 학습",
    updatedAt: "2025-01-24T15:00:00Z",
    ProductTypeDesc: "Leaf Spring",
    productImageUrl: "/3D Asset/Leaf Spring/판스프링 조립도.png",
    viewInfo: { ...defaultViewInfo, partId: 5 },
  },
  {
    userStudyHisId: 6,
    title: "로봇 집게 학습",
    updatedAt: "2025-01-25T13:00:00Z",
    ProductTypeDesc: "Robot Gripper",
    productImageUrl: "/3D Asset/Robot Gripper/로봇집게 조립도.png",
    viewInfo: { ...defaultViewInfo, partId: 6 },
  },
  {
    userStudyHisId: 7,
    title: "로봇 팔 학습",
    updatedAt: "2025-01-26T16:00:00Z",
    ProductTypeDesc: "Robot Arm",
    productImageUrl: "/3D Asset/Robot Arm/로보팔 조립도.png",
    viewInfo: { ...defaultViewInfo, partId: 7 },
  },
];

export let mockStudyHistories: UserStudyHistory[] = [...initialHistories];

let nextStudyId = initialHistories.length + 1;

export function getNextStudyId() {
  return nextStudyId++;
}

export function resetStudyHistories() {
  mockStudyHistories = [...initialHistories];
  nextStudyId = initialHistories.length + 1;
}
