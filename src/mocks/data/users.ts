import type { UserInfo } from "@/type/user";
import type { MemoItem } from "@/type/memo";

export const mockUserInfo: UserInfo = {
  userId: 1,
  nickname: "테스트유저",
  major: "기계공학",
  grade: 3,
  goal: "엔지니어링 학습",
  role: "USER",
  roleType: "USER",
};

export let mockMemos: MemoItem[] = [
  {
    memoId: "1",
    title: "드론 프레임 메모",
    content: "메인 프레임 구조 분석 내용입니다.",
    updatedAt: "2025-01-15T10:30:00Z",
    productTypeDesc: "Drone",
  },
  {
    memoId: "2",
    title: "V4 엔진 메모",
    content: "피스톤 구동 원리 정리.",
    updatedAt: "2025-01-16T14:00:00Z",
    productTypeDesc: "V4 Engine",
  },
  {
    memoId: "3",
    title: "서스펜션 스프링",
    content: "스프링 탄성 계수 관련 메모.",
    updatedAt: "2025-01-17T09:00:00Z",
    productTypeDesc: "Suspension",
  },
];

let nextMemoId = 4;

export function getNextMemoId() {
  return String(nextMemoId++);
}

export function resetMemos() {
  mockMemos = [
    {
      memoId: "1",
      title: "드론 프레임 메모",
      content: "메인 프레임 구조 분석 내용입니다.",
      updatedAt: "2025-01-15T10:30:00Z",
      productTypeDesc: "Drone",
    },
    {
      memoId: "2",
      title: "V4 엔진 메모",
      content: "피스톤 구동 원리 정리.",
      updatedAt: "2025-01-16T14:00:00Z",
      productTypeDesc: "V4 Engine",
    },
    {
      memoId: "3",
      title: "서스펜션 스프링",
      content: "스프링 탄성 계수 관련 메모.",
      updatedAt: "2025-01-17T09:00:00Z",
      productTypeDesc: "Suspension",
    },
  ];
  nextMemoId = 4;
}
