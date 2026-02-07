"use client";
import { useEffect, useState } from "react";
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
import { UserStudyHistory, fetchUserStudyHistories } from "@/apis/studyApi";

const ITEMS_PER_PAGE = 20;

export default function HomePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [histories, setHistories] = useState<UserStudyHistory[]>([]);

  useEffect(() => {
    fetchUserStudyHistories()
      .then(setHistories)
      .catch(() => setHistories([]));
  }, []);

  const lastPage = Math.max(1, Math.ceil(histories.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCards = histories.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleStudyCreated = () => {
    fetchUserStudyHistories()
      .then(setHistories)
      .catch(() => setHistories([]));
  };

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
          {currentCards.map((h) => (
            <StudyCard
              key={h.userStudyHisId}
              thumbnail={h.productImageUrl}
              domain={h.ProductTypeDesc}
              title={h.title}
              date={new Date(h.updatedAt).toLocaleDateString("ko-KR")}
              onClick={() => router.push(`/study/${h.ProductTypeDesc.toLowerCase()}`)}
            />
          ))}
        </CardGrid>
        {histories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Column>
      <NewStudyModal
        open={studyModalOpen}
        onClose={() => setStudyModalOpen(false)}
        onCreated={handleStudyCreated}
      />
    </Column>
  );
}

const CardGrid = styled(Grid)`
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  row-gap: 40px;
`;
