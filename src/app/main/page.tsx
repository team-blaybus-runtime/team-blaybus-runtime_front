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
import { UserStudyHistory, fetchUserStudyHistories } from "@/apis/study";

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
        {histories.length === 0 ? (
          <EmptyState>
            <EmptyIcon />
            <Font typo="label_m" color={colors.neutral_600}>
              아직 학습 내역이 없습니다
            </Font>
            <Font typo="caption_m" color={colors.neutral_700}>
              새로 학습하기 버튼을 눌러 첫 학습을 시작해보세요
            </Font>
          </EmptyState>
        ) : (
          <>
            <CardGrid>
              {currentCards.map((h) => (
                <StudyCard
                  key={h.userStudyHisId}
                  thumbnail={h.productImageUrl}
                  domain={h.ProductTypeDesc}
                  title={h.title}
                  date={new Date(h.updatedAt).toLocaleDateString("ko-KR")}
                  onClick={() => router.push(`/study/${h.userStudyHisId}`)}
                />
              ))}
            </CardGrid>
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={setCurrentPage}
            />
          </>
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

const EmptyState = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 120px 0;
`;

function EmptyIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="12"
        width="48"
        height="40"
        rx="4"
        stroke={colors.neutral_800}
        strokeWidth="2"
      />
      <path
        d="M8 22H56"
        stroke={colors.neutral_800}
        strokeWidth="2"
      />
      <circle cx="16" cy="17" r="2" fill={colors.neutral_700} />
      <circle cx="22" cy="17" r="2" fill={colors.neutral_700} />
      <circle cx="28" cy="17" r="2" fill={colors.neutral_700} />
      <path
        d="M24 36L30 30L36 36L44 28"
        stroke={colors.neutral_700}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
