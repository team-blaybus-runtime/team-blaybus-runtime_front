export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

export type StudyQuizData = {
  title: string;
  components: string[];
  questions: QuizQuestion[];
};

const STUDY_QUIZ_DATA: Record<string, StudyQuizData> = {
  drone: {
    title: "Drone",
    components: [
      "Main frame",
      "Main frame MIR",
      "Arm gear",
      "Beater disc",
      "Gearing",
      "Impellar Blade",
      "Leg",
      "Nut",
      "Screw",
      "xyz",
    ],
    questions: [
      {
        id: "drone-q1",
        question: "드론의 주요 구조 프레임에 해당하는 부품은?",
        options: ["Main frame", "Piston", "Crankshaft", "Leaf-Layer"],
        answerIndex: 0,
        explanation: "드론의 기본 뼈대는 Main frame입니다.",
      },
      {
        id: "drone-q2",
        question: "회전 구동과 기어 구조에 직접 관련된 부품은?",
        options: ["Gearing", "Leg", "Nut", "Base Plate"],
        answerIndex: 0,
      },
      {
        id: "drone-q3",
        question: "드론의 추진 블레이드에 해당하는 부품은?",
        options: ["Impellar Blade", "Pin", "ROD", "Support"],
        answerIndex: 0,
      },
      {
        id: "drone-q4",
        question: "체결용 하드웨어에 해당하는 부품은?",
        options: ["Nut", "Upper Arm Link", "Clamp-Center", "Spannbacke"],
        answerIndex: 0,
      },
      {
        id: "drone-q5",
        question: "드론 하부 지지 역할을 하는 부품은?",
        options: ["Leg", "Base Gear", "Piston Ring", "Support-Rubber"],
        answerIndex: 0,
      },
      {
        id: "drone-q6",
        question: "드론 구성품 목록에 포함되지 않는 것은?",
        options: ["Conrod Bolt", "Arm gear", "Beater disc", "Screw"],
        answerIndex: 0,
      },
    ],
  },
  "machine-vice": {
    title: "Machine Vice",
    components: [
      "Fuhrung",
      "Part1",
      "Feste Backe",
      "Lose Backe",
      "Spindelsockel",
      "Spannbacke",
      "Fuhrungschiene",
      "TrapezSpindel",
      "Grundplatte",
      "Druckhulse",
    ],
    questions: [
      {
        id: "mv-q1",
        question: "바이스의 기본 베이스 플레이트에 해당하는 부품은?",
        options: ["Grundplatte", "Piston", "Leaf-Layer", "Base Gear"],
        answerIndex: 0,
      },
      {
        id: "mv-q2",
        question: "나사 구동축 역할을 하는 부품은?",
        options: ["TrapezSpindel", "Clamp-Secondary", "ROD", "Link"],
        answerIndex: 0,
      },
      {
        id: "mv-q3",
        question: "바이스의 고정 죠(Backe)에 해당하는 부품은?",
        options: ["Feste Backe", "Gripper", "Support", "Wrist Joint"],
        answerIndex: 0,
      },
      {
        id: "mv-q4",
        question: "가이드를 담당하는 부품 이름으로 알맞은 것은?",
        options: ["Fuhrungschiene", "Piston Pin", "Base Plate", "Clamp-Center"],
        answerIndex: 0,
      },
      {
        id: "mv-q5",
        question: "바이스 구성품 목록에 포함되지 않는 것은?",
        options: ["Crankshaft", "Druckhulse", "Spannbacke", "Fuhrung"],
        answerIndex: 0,
      },
      {
        id: "mv-q6",
        question: "Part3-lose backe는 어떤 성격의 부품인가요?",
        options: ["이동 죠(가동 부품)", "고정 프레임", "스프링", "고정 베이스"],
        answerIndex: 0,
      },
    ],
  },
  suspension: {
    title: "Suspension",
    components: ["BASE", "NIT", "NUT", "ROD", "SPRING"],
    questions: [
      {
        id: "sus-q1",
        question: "서스펜션의 탄성 요소에 해당하는 부품은?",
        options: ["SPRING", "NUT", "BASE", "ROD"],
        answerIndex: 0,
      },
      {
        id: "sus-q2",
        question: "축 방향 지지와 연결에 사용되는 부품은?",
        options: ["ROD", "Gripper", "Clamp-Primary", "Piston Ring"],
        answerIndex: 0,
      },
      {
        id: "sus-q3",
        question: "서스펜션 구성품 목록에 포함되지 않는 것은?",
        options: ["Main frame", "BASE", "NIT", "NUT"],
        answerIndex: 0,
      },
      {
        id: "sus-q4",
        question: "NUT는 어떤 용도로 사용되나요?",
        options: ["체결 및 고정", "동력 전달", "회전 관절", "그리핑"],
        answerIndex: 0,
      },
      {
        id: "sus-q5",
        question: "BASE 부품의 역할로 가장 알맞은 것은?",
        options: ["구조 지지 및 기준점 제공", "블레이드 회전", "유압 생성", "클램핑"],
        answerIndex: 0,
      },
    ],
  },
  "robot-arm": {
    title: "Robot Arm",
    components: [
      "Base",
      "Base Joint",
      "Shoulder Joint",
      "Upper Arm Link",
      "Elbow Joint",
      "Forearm Link",
      "Wrist Joint",
      "End Effector Mount",
    ],
    questions: [
      {
        id: "ra-q1",
        question: "로봇 암의 기준 지지 구조물은?",
        options: ["Base", "Gripper", "Piston", "Spannbacke"],
        answerIndex: 0,
      },
      {
        id: "ra-q2",
        question: "팔꿈치 관절에 해당하는 부품은?",
        options: ["Elbow Joint", "Wrist Joint", "Base Joint", "Upper Arm Link"],
        answerIndex: 0,
      },
      {
        id: "ra-q3",
        question: "End Effector Mount의 역할로 알맞은 것은?",
        options: ["도구 장착을 위한 끝단 연결부", "구동 스프링", "체결용 너트", "기어 회전"],
        answerIndex: 0,
      },
      {
        id: "ra-q4",
        question: "Shoulder Joint가 담당하는 기능은?",
        options: ["팔을 들어 올리고 자세를 결정", "그리핑 동작", "체결 유지", "회전축 고정"],
        answerIndex: 0,
      },
      {
        id: "ra-q5",
        question: "로봇 암 구성품 목록에 포함되지 않는 것은?",
        options: ["Piston Ring", "Forearm Link", "Wrist Joint", "Upper Arm Link"],
        answerIndex: 0,
      },
      {
        id: "ra-q6",
        question: "Base Joint는 어떤 동작에 가깝나요?",
        options: ["좌우 회전", "상하 슬라이딩", "그리핑", "체결"],
        answerIndex: 0,
      },
    ],
  },
  "robot-gripper": {
    title: "Robot Gripper",
    components: [
      "Base Gear",
      "Base Mounting bracket",
      "Base Plate",
      "Gear link 1",
      "Gear link 2",
      "Gripper",
      "Link",
      "Pin",
    ],
    questions: [
      {
        id: "rg-q1",
        question: "실제 집게 동작을 수행하는 부품은?",
        options: ["Gripper", "Base Plate", "Pin", "Link"],
        answerIndex: 0,
      },
      {
        id: "rg-q2",
        question: "구동 전달을 돕는 링크 부품은?",
        options: ["Gear link 1", "Support", "Piston", "Clamp-Center"],
        answerIndex: 0,
      },
      {
        id: "rg-q3",
        question: "로봇 집게 구성품 목록에 포함되지 않는 것은?",
        options: ["Crankshaft", "Base Gear", "Base Mounting bracket", "Pin"],
        answerIndex: 0,
      },
      {
        id: "rg-q4",
        question: "Base Plate의 역할로 가장 알맞은 것은?",
        options: ["기본 지지 구조 제공", "체결용 너트", "탄성 제공", "가동 죠"],
        answerIndex: 0,
      },
      {
        id: "rg-q5",
        question: "Pin 부품의 용도는?",
        options: ["회전/연결 축 역할", "스프링 압축", "블레이드 회전", "유압 생성"],
        answerIndex: 0,
      },
    ],
  },
  "leaf-spring": {
    title: "Leaf Spring",
    components: [
      "Clamp-Center",
      "Clamp-Primary",
      "Clamp-Secondary",
      "Leaf-Layer",
      "Support",
      "Support-Chassis Rigid",
      "Support-Chassis",
      "Support-Rubber 60mm",
      "Support-Rubber",
    ],
    questions: [
      {
        id: "ls-q1",
        question: "판스프링의 적층 구조를 이루는 부품은?",
        options: ["Leaf-Layer", "Crankshaft", "Gripper", "Base Gear"],
        answerIndex: 0,
      },
      {
        id: "ls-q2",
        question: "중앙 클램프에 해당하는 부품은?",
        options: ["Clamp-Center", "Clamp-Secondary", "Support", "Pin"],
        answerIndex: 0,
      },
      {
        id: "ls-q3",
        question: "차체 지지와 관련된 부품은?",
        options: ["Support-Chassis", "Piston Ring", "Wrist Joint", "Spannbacke"],
        answerIndex: 0,
      },
      {
        id: "ls-q4",
        question: "판스프링 구성품 목록에 포함되지 않는 것은?",
        options: ["Impellar Blade", "Support-Rubber", "Clamp-Primary", "Support"],
        answerIndex: 0,
      },
      {
        id: "ls-q5",
        question: "Support-Rubber 60mm는 어떤 용도에 가깝나요?",
        options: ["진동/충격 완화", "회전 구동", "그리핑", "체결 고정"],
        answerIndex: 0,
      },
    ],
  },
  "v4-engine": {
    title: "V4 Engine",
    components: [
      "Piston",
      "Piston Ring",
      "Piston Pin",
      "Crankshaft",
      "Conrod Bolt",
      "Connecting Rod",
      "Connecting Rod Cap",
    ],
    questions: [
      {
        id: "v4-q1",
        question: "연소 압력을 왕복 운동으로 전달하는 부품은?",
        options: ["Piston", "Leaf-Layer", "Base Plate", "Spannbacke"],
        answerIndex: 0,
      },
      {
        id: "v4-q2",
        question: "회전 운동을 만들어내는 중심 축 부품은?",
        options: ["Crankshaft", "Pin", "Support", "Base Gear"],
        answerIndex: 0,
      },
      {
        id: "v4-q3",
        question: "커넥팅 로드의 체결에 쓰이는 부품은?",
        options: ["Conrod Bolt", "Nut", "Clamp-Secondary", "Link"],
        answerIndex: 0,
      },
      {
        id: "v4-q4",
        question: "피스톤 링의 주요 목적은?",
        options: ["기밀 유지 및 압축 효율 향상", "구동축 회전", "그리핑", "지지 구조 제공"],
        answerIndex: 0,
      },
      {
        id: "v4-q5",
        question: "V4 엔진 구성품 목록에 포함되지 않는 것은?",
        options: ["Base Mounting bracket", "Piston Pin", "Connecting Rod", "Connecting Rod Cap"],
        answerIndex: 0,
      },
      {
        id: "v4-q6",
        question: "Piston Pin의 역할로 알맞은 것은?",
        options: ["피스톤과 커넥팅 로드 연결", "회전 기어 구동", "클램핑", "베이스 지지"],
        answerIndex: 0,
      },
    ],
  },
};

export function getStudyQuizData(objectId: string): StudyQuizData | null {
  return STUDY_QUIZ_DATA[objectId] ?? null;
}

export function getAllQuizComponents(): string[] {
  return Object.values(STUDY_QUIZ_DATA).flatMap((data) => data.components);
}
