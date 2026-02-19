import type { AIChatMessage } from "@/type/aiChat";

export const mockAiResponses: string[] = [
  "이 부품은 기계 시스템에서 중요한 역할을 합니다. 주요 기능은 하중을 지지하고 동력을 전달하는 것입니다. 재질은 일반적으로 강철이나 알루미늄 합금이 사용되며, 제조 공정에서 정밀 가공이 필요합니다.",
  "조립 순서를 설명드리겠습니다.\n\n1. 먼저 베이스 플레이트를 작업대에 고정합니다.\n2. 메인 프레임을 베이스에 볼트로 체결합니다.\n3. 구동 부품을 프레임에 삽입합니다.\n4. 마지막으로 커버를 덮고 최종 검사를 진행합니다.\n\n각 단계에서 토크 값을 확인하는 것이 중요합니다.",
  "엔지니어링 설계에서 이 구조는 **응력 분산**에 최적화되어 있습니다. FEA(유한요소해석) 결과에 따르면 최대 응력은 연결부에서 발생하며, 안전율은 약 2.5입니다.",
];

let responseIndex = 0;

export function getNextAiResponse(): string {
  const response = mockAiResponses[responseIndex % mockAiResponses.length];
  responseIndex++;
  return response;
}

export const mockChatMessages: AIChatMessage[] = [
  {
    chatMessageId: 1,
    content: "드론의 메인 프레임에 대해 설명해주세요.",
    role: "QUESTION",
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    chatMessageId: 2,
    content:
      "드론의 메인 프레임은 모든 부품이 결합되는 중심 구조물입니다. 탄소 섬유나 알루미늄 합금으로 제작되며, 경량성과 강성이 중요합니다.",
    role: "ANSWER",
    createdAt: "2025-01-20T10:00:05Z",
  },
  {
    chatMessageId: 3,
    content: "프레임의 강도를 높이려면 어떻게 해야 하나요?",
    role: "QUESTION",
    createdAt: "2025-01-20T10:01:00Z",
  },
  {
    chatMessageId: 4,
    content:
      "프레임 강도를 높이는 방법으로는 리브 구조 추가, 재질 변경(탄소 섬유 복합재), 두께 최적화 등이 있습니다. 다만 무게와의 트레이드오프를 고려해야 합니다.",
    role: "ANSWER",
    createdAt: "2025-01-20T10:01:05Z",
  },
];
