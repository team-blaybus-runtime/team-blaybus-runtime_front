import type {
  EngineeringProductType,
  EngineeringPart,
} from "@/apis/engineering";

/*
 * 부품별 고유 색상의 SVG 플레이스홀더 생성
 * 실제 백엔드는 S3에 저장된 개별 부품 렌더 이미지를 반환하지만,
 * mock 환경에서는 부품명이 표시된 컬러 플레이스홀더로 대체
 */
const PART_COLORS = [
  "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981",
  "#06B6D4", "#EF4444", "#6366F1", "#14B8A6", "#F97316",
  "#A855F7", "#22C55E", "#E11D48", "#0EA5E9", "#84CC16",
];

function partImageUrl(partName: string, index: number): string {
  const color = PART_COLORS[index % PART_COLORS.length];
  const label = partName.length > 14 ? partName.slice(0, 13) + "…" : partName;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="12" fill="${color}20"/>
    <rect x="30" y="30" width="100" height="100" rx="50" fill="${color}30" stroke="${color}" stroke-width="2"/>
    <text x="80" y="86" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="${color}">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const mockProductTypes: EngineeringProductType[] = [
  {
    productTypeDesc: "Drone",
    imageUrl: "/3D Asset/Drone/조립도1.png",
  },
  {
    productTypeDesc: "V4 Engine",
    imageUrl: "/3D Asset/V4_Engine/V4실린더 엔진 조립도.png",
  },
  {
    productTypeDesc: "Suspension",
    imageUrl: "/3D Asset/Suspension/서스펜션 조립도.png",
  },
  {
    productTypeDesc: "Machine Vice",
    imageUrl: "/3D Asset/Machine Vice/공작 기계 바이스.jpg",
  },
  {
    productTypeDesc: "Leaf Spring",
    imageUrl: "/3D Asset/Leaf Spring/판스프링 조립도.png",
  },
  {
    productTypeDesc: "Robot Gripper",
    imageUrl: "/3D Asset/Robot Gripper/로봇집게 조립도.png",
  },
  {
    productTypeDesc: "Robot Arm",
    imageUrl: "/3D Asset/Robot Arm/로보팔 조립도.png",
  },
];

/*
 * partName → normalizeKey → productLayouts.ts 레이아웃 키 매칭
 * normalizeKey: lowercase + 영숫자/한글만 남김
 * 예: "Main Frame" → "mainframe", "Gear Link 1" → "gearlink1"
 */

type PartDef = Omit<EngineeringPart, "imageUrl">;

function withImages(parts: PartDef[]): EngineeringPart[] {
  return parts.map((p, i) => ({ ...p, imageUrl: partImageUrl(p.partName, i) }));
}

export const mockParts: Record<string, EngineeringPart[]> = {
  /* ─── Drone ─── */
  Drone: withImages([
    {
      partName: "Main Frame",
      content: "드론의 중심 구조물로 모든 부품이 결합되는 기본 프레임입니다.",
      assetUrl: "/3D Asset/Drone/Main frame.glb",
    },
    {
      partName: "Main Frame Mirror",
      content: "메인 프레임의 대칭(미러) 파트입니다.",
      assetUrl: "/3D Asset/Drone/Main frame_MIR.glb",
    },
    {
      partName: "Beater Disc",
      content: "회전 디스크 부품입니다.",
      assetUrl: "/3D Asset/Drone/Beater disc.glb",
    },
    {
      partName: "Arm Gear",
      content: "프로펠러 암을 고정하고 회전력을 전달하는 기어입니다.",
      assetUrl: "/3D Asset/Drone/Arm gear.glb",
    },
    {
      partName: "Gearing",
      content: "동력 전달을 위한 기어 시스템입니다.",
      assetUrl: "/3D Asset/Drone/Gearing.glb",
    },
    {
      partName: "Impeller Blade",
      content: "추력을 생성하는 프로펠러 블레이드입니다.",
      assetUrl: "/3D Asset/Drone/Impellar Blade.glb",
    },
    {
      partName: "Landing Leg",
      content: "드론의 착지 장치(랜딩 기어)입니다.",
      assetUrl: "/3D Asset/Drone/Leg.glb",
    },
    {
      partName: "Nut",
      content: "프로펠러 축을 고정하는 너트입니다.",
      assetUrl: "/3D Asset/Drone/Nut.glb",
    },
    {
      partName: "Screw",
      content: "프레임 결합용 나사입니다.",
      assetUrl: "/3D Asset/Drone/Screw.glb",
    },
  ]),

  /* ─── V4 Engine ─── */
  "V4 Engine": withImages([
    {
      partName: "Crankshaft",
      content: "피스톤의 왕복 운동을 회전 운동으로 변환하는 크랭크축입니다.",
      assetUrl: "/3D Asset/V4_Engine/Crankshaft.glb",
    },
    {
      partName: "Connecting Rod Cap",
      content: "커넥팅 로드 하단을 크랭크축에 체결하는 캡입니다.",
      assetUrl: "/3D Asset/V4_Engine/Connecting Rod Cap.glb",
    },
    {
      partName: "Connecting Rod",
      content: "피스톤과 크랭크축을 연결하는 커넥팅 로드입니다.",
      assetUrl: "/3D Asset/V4_Engine/Connecting Rod.glb",
    },
    {
      partName: "Piston",
      content: "연소 압력을 받아 왕복 운동하는 피스톤입니다.",
      assetUrl: "/3D Asset/V4_Engine/Piston.glb",
    },
    {
      partName: "Piston Pin",
      content: "피스톤과 커넥팅 로드를 연결하는 핀입니다.",
      assetUrl: "/3D Asset/V4_Engine/Piston Pin.glb",
    },
    {
      partName: "Piston Ring",
      content: "실린더 벽과의 기밀을 유지하는 피스톤 링입니다.",
      assetUrl: "/3D Asset/V4_Engine/Piston Ring.glb",
    },
    {
      partName: "Conrod Bolt",
      content: "커넥팅 로드 캡을 체결하는 볼트입니다.",
      assetUrl: "/3D Asset/V4_Engine/Conrod Bolt.glb",
    },
  ]),

  /* ─── Suspension ─── */
  Suspension: withImages([
    {
      partName: "Upper Mount",
      content: "서스펜션 상단 마운트로 차체에 고정되는 부품입니다.",
      assetUrl: "/3D Asset/Suspension/BASE.glb",
    },
    {
      partName: "Damper Rod",
      content: "감쇠력을 발생시키는 댐퍼 로드입니다.",
      assetUrl: "/3D Asset/Suspension/ROD.glb",
    },
    {
      partName: "Coil Spring",
      content: "충격을 흡수하는 코일 스프링입니다.",
      assetUrl: "/3D Asset/Suspension/SPRING.glb",
    },
    {
      partName: "Spring Adjustment Nut",
      content: "스프링 프리로드를 조절하는 너트입니다.",
      assetUrl: "/3D Asset/Suspension/NUT.glb",
    },
    {
      partName: "Lock Nut",
      content: "조절 너트를 고정하는 잠금 너트입니다.",
      assetUrl: "/3D Asset/Suspension/NIT.glb",
    },
  ]),

  /* ─── Machine Vice ─── */
  "Machine Vice": withImages([
    {
      partName: "Vise Body",
      content: "바이스의 본체 프레임입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part1.glb",
    },
    {
      partName: "Guide Housing",
      content: "이동 죠를 안내하는 가이드 하우징(Führung)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part1 Fuhrung.glb",
    },
    {
      partName: "Fixed Jaw",
      content: "고정 죠(Feste Backe)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part2 Feste Backe.glb",
    },
    {
      partName: "Movable Jaw",
      content: "스핀들에 의해 이동하는 죠(Lose Backe)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part3-lose backe.glb",
    },
    {
      partName: "Spindle Housing",
      content: "스핀들을 지지하는 하우징(Spindelsockel)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part4 spindelsockel.glb",
    },
    {
      partName: "Clamping Jaw",
      content: "워크피스를 직접 잡는 클램핑 죠(Spannbacke)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part5-Spannbacke.glb",
    },
    {
      partName: "Guide Rail",
      content: "이동 죠의 직선 운동을 안내하는 레일(Führungsschiene)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part6-fuhrungschiene.glb",
    },
    {
      partName: "Trapezoidal Spindle",
      content: "클램핑 력을 전달하는 사다리꼴 나사(Trapezspindel)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part7-TrapezSpindel.glb",
    },
    {
      partName: "Base Plate",
      content: "바이스 전체를 지지하는 베이스 플레이트(Grundplatte)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part8-grundplatte.glb",
    },
    {
      partName: "Pressure Sleeve",
      content: "스핀들 축방향 힘을 전달하는 압력 슬리브(Druckhülse)입니다.",
      assetUrl: "/3D Asset/Machine Vice/Part9-Druckhulse.glb",
    },
  ]),

  /* ─── Leaf Spring ─── */
  "Leaf Spring": withImages([
    {
      partName: "Leaf Layer",
      content: "판스프링의 주 스프링 층입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Leaf-Layer.glb",
    },
    {
      partName: "Clamp Center",
      content: "중앙 클램프로 스프링 층을 고정합니다.",
      assetUrl: "/3D Asset/Leaf Spring/Clamp-Center.glb",
    },
    {
      partName: "Clamp Primary",
      content: "1차 클램프입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Clamp-Primary.glb",
    },
    {
      partName: "Clamp Secondary",
      content: "2차 클램프입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Clamp-Secondary.glb",
    },
    {
      partName: "Support",
      content: "스프링을 지지하는 브라켓입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Support.glb",
    },
    {
      partName: "Support Rubber",
      content: "진동을 흡수하는 고무 서포트입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Support-Rubber.glb",
    },
    {
      partName: "Support Rubber 60mm",
      content: "60mm 규격 고무 서포트입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Support-Rubber 60mm.glb",
    },
    {
      partName: "Support Chassis",
      content: "차체에 스프링을 연결하는 마운트입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Support-Chassis.glb",
    },
    {
      partName: "Support Chassis Rigid",
      content: "리지드 타입 차체 마운트입니다.",
      assetUrl: "/3D Asset/Leaf Spring/Support-Chassis Rigid.glb",
    },
  ]),

  /* ─── Robot Gripper ─── */
  "Robot Gripper": withImages([
    {
      partName: "Base Plate",
      content: "그리퍼 전체를 지지하는 베이스 플레이트입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Base Plate.glb",
    },
    {
      partName: "Mounting Bracket",
      content: "로봇 암에 그리퍼를 장착하는 브라켓입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Base Mounting bracket.glb",
    },
    {
      partName: "Base Gear",
      content: "그리퍼 구동의 기본 기어입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Base Gear.glb",
    },
    {
      partName: "Gear Link 1",
      content: "기어와 링크를 연결하는 1번 기어 링크입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Gear link 1.glb",
    },
    {
      partName: "Gear Link 2",
      content: "기어와 링크를 연결하는 2번 기어 링크입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Gear link 2.glb",
    },
    {
      partName: "Link Arm",
      content: "그리퍼 죠와 기어를 연결하는 링크 암입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Link.glb",
    },
    {
      partName: "Gripper Jaw",
      content: "물체를 직접 잡는 그리퍼 죠입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Gripper.glb",
    },
    {
      partName: "Pin",
      content: "링크 조인트를 연결하는 핀입니다.",
      assetUrl: "/3D Asset/Robot Gripper/Pin.glb",
    },
  ]),

  /* ─── Robot Arm ─── */
  "Robot Arm": withImages([
    {
      partName: "Base",
      content: "로봇 암의 고정 베이스입니다.",
      assetUrl: "/3D Asset/Robot Arm/base.glb",
    },
    {
      partName: "Shoulder Joint",
      content: "1축 회전을 담당하는 어깨 관절입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part2.glb",
    },
    {
      partName: "Upper Arm Link",
      content: "어깨와 팔꿈치를 연결하는 상완 링크입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part3.glb",
    },
    {
      partName: "Elbow Joint",
      content: "2축 굽힘을 담당하는 팔꿈치 관절입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part4.glb",
    },
    {
      partName: "Forearm Link",
      content: "팔꿈치와 손목을 연결하는 전완 링크입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part5.glb",
    },
    {
      partName: "Wrist Joint",
      content: "엔드 이펙터의 자세를 제어하는 손목 관절입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part6.glb",
    },
    {
      partName: "End Effector Interface",
      content: "엔드 이펙터를 장착하는 인터페이스입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part7.glb",
    },
    {
      partName: "Gripper",
      content: "물체를 잡는 엔드 이펙터(그리퍼)입니다.",
      assetUrl: "/3D Asset/Robot Arm/Part8.glb",
    },
  ]),
};
