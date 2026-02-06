"use client";
import { useState } from "react";
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

const mockCards = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  domain: "물리학",
  title: `학습 주제 ${i + 1}`,
  date: "2026.01.15",
}));

export default function HomePage() {
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
              domain={card.domain}
              title={card.title}
              date={card.date}
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
