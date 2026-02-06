"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { Column, Row, Grid } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import MainInfo from "@/component/main/MainInfo";
import StudyCard from "@/component/main/StudyCard";
import NewStudyBtn from "@/component/main/NewStudyBtn";
import NewStudyModal from "@/component/main/NewStudyModal";
import Pagination from "@/component/common/Pagination";

const ITEMS_PER_PAGE = 20;

// 실제 3D 에셋 기반 테스트 데이터
const STUDY_OBJECTS = [
  { id: "drone", name: "Drone", domain: "항공", thumbnail: "/3D Asset/Drone/조립도1.png" },
  { id: "machine-vice", name: "Machine Vice", domain: "공작기계", thumbnail: "/3D Asset/Machine Vice/공작 기계 바이스2.png" },
  { id: "suspension", name: "Suspension", domain: "자동차", thumbnail: "/3D Asset/Suspension/서스펜션 조립도.png" },
  { id: "robot-arm", name: "Robot Arm", domain: "로봇공학", thumbnail: "/3D Asset/Robot Arm/로보팔 조립도.png" },
  { id: "robot-gripper", name: "Robot Gripper", domain: "로봇공학", thumbnail: "/3D Asset/Robot Gripper/로봇집게 조립도.png" },
  { id: "leaf-spring", name: "Leaf Spring", domain: "자동차", thumbnail: "/3D Asset/Leaf Spring/판스프링 조립도.png" },
  { id: "v4-engine", name: "V4 Engine", domain: "엔진", thumbnail: "/3D Asset/V4_Engine/V4실린더 엔진 조립도.png" },
];

const mockCards = STUDY_OBJECTS.flatMap((obj, objIdx) =>
  Array.from({ length: 3 }, (_, i) => ({
    id: `${obj.id}-${i}`,
    objectId: obj.id,
    domain: obj.domain,
    title: obj.name,
    thumbnail: obj.thumbnail,
    date: `2026.01.${String(15 - objIdx * 2 - i).padStart(2, "0")}`,
  }))
);

export default function HomePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const lastPage = Math.ceil(mockCards.length / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCards = mockCards.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <Column width="100%">
      <MainInfo />
      <Column py="40px" gridGap="24px">
        <Row justifyContent="space-between" alignItems="center">
          <Font typo="title_3" color={colors.neutral_0}>
            학습 내역
          </Font>
          <NewStudyBtn onClick={() => setStudyModalOpen(true)} />
        </Row>
        <CardGrid>
          {currentCards.map((card) => (
            <StudyCard
              key={card.id}
              thumbnail={card.thumbnail}
              domain={card.domain}
              title={card.title}
              date={card.date}
              onClick={() => router.push(`/study/${card.objectId}`)}
            />
          ))}
        </CardGrid>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={setCurrentPage}
        />
      </Column>
      <NewStudyModal
        open={studyModalOpen}
        onClose={() => setStudyModalOpen(false)}
      />
    </Column>
  );
}

const CardGrid = styled(Grid)`
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  row-gap: 40px;
`;
