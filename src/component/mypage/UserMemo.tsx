"use client";

import { Column, Grid, Row } from "@/styles/base/BaseComponents";
import Pagination from "@/component/common/Pagination";
import { Font } from "@/styles/typo/typography";
import MemoCard from "@/component/mypage/MemoCard";
import MemoModal from "@/component/mypage/MemoModal";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MemoItem } from "@/type/memo";
import EmptyMemo from "@/component/mypage/EmptyMemo";

export default function UserMemo() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMemo, setSelectedMemo] = useState<MemoItem | null>(null);
  const lastPage = 7;
  const memos: MemoItem[] = [
    {
      id: "memo-1",
      title: "머신 바이스 체결할때 헷갈린점",
      tag: "Machine Vice",
      preview:
        "・죠(jaw) 간격 조절 시 나사 피치 중요 ・체결 시 미끄럼 방지용 톱니 구조 확인",
      createdAt: "2026.02.03",
      items: [
        "죠(jaw) 간격 조절 시 나사 피치 중요",
        "체결 시 미끄럼 방지용 톱니 구조 확인",
        "하중은 수직 방향에 최적화됨",
        "고정 죠와 이동 죠 평행도 유지 필요",
        "반복 체결 시 벽체시 발생 가능성 있음",
        "죠 표면 마모되면 체결력 급감",
        "강재 가공 시 체결력 충분히 확보 필요",
        "알루미늄 소재는 과도한 체결 주의",
        "장시간 사용 시 열에 의한 변형 고려",
        "작업물 중심선과 바이스 중심 정렬 중요",
        "편심 체결 시 죠 한쪽에 응력 집중",
        "진동 발생 시 체결력 재점검 필요",
      ],
    },
    {
      id: "memo-2",
      title: "선반 공구 세팅 체크리스트",
      tag: "Lathe",
      preview: "・툴 높이 중심 맞추기 ・가공 방향에 따른 공구 각도 확인",
      createdAt: "2026.02.01",
      items: [
        "툴 높이 중심 맞추기",
        "가공 방향에 따른 공구 각도 확인",
        "초기 시운전 후 절삭음 확인",
      ],
    },
    {
      id: "memo-3",
      title: "로봇 암 DOF랑 좌표계 정리",
      tag: "Robot Arm",
      preview: "각 관절 DOF = 6축, 엔드이펙터 기준 좌표계 변환 필요",
      createdAt: "2026.02.03",
      items: [
        "각 관절 DOF = 6축",
        "엔드이펙터 기준 좌표계 변환 필요",
        "기준좌표는 베이스 프레임 기준 정렬",
      ],
    },
    {
      id: "memo-4",
      title: "로봇 그리퍼 힘 계산 정리",
      tag: "Robot Gripper",
      preview: "평행 그리퍼, 마찰계수 고려 필요, 물체 무게 대비 클램핑 힘 계산",
      createdAt: "2026.02.03",
      items: [
        "평행 그리퍼는 마찰계수 고려 필수",
        "물체 무게 대비 클램핑 힘 계산",
        "재질별 마찰계수 표 정리 필요",
      ],
    },
    {
      id: "memo-5",
      title: "리프 스프링 응력 헷갈린 부분",
      tag: "Leaf Spring",
      preview: "판 스프링은 굽힘 응력 분포가 핵심, 중앙부 최대 응력 발생",
      createdAt: "2026.02.03",
      items: [
        "판 스프링은 굽힘 응력 분포가 핵심",
        "중앙부 최대 응력 발생",
        "잔류 하중 분산 역할 고려",
      ],
    },
    {
      id: "memo-6",
      title: "서스펜션 진동 줄이는 원리",
      tag: "Suspension",
      preview: "스프링 + 댐퍼 조합, 진동 전달 최소화 목적",
      createdAt: "2026.02.03",
      items: [
        "스프링 + 댐퍼 조합",
        "진동 전달 최소화 목적",
        "감쇠비 설정이 승차감 결정",
      ],
    },
    {
      id: "memo-7",
      title: "V4 엔진 진동 생기는 이유",
      tag: "V4_Engine",
      preview: "4기통 직렬 구조, 점화 순서에 따라 진동 발생",
      createdAt: "2026.02.03",
      items: [
        "4기통 직렬 구조",
        "점화 순서에 따라 진동 발생",
        "밸런스 샤프트로 상쇄 가능",
      ],
    },
    {
      id: "memo-8",
      title: "엔진 밸런스 샤프트 체결 방법",
      tag: "Engine Balance Shaft",
      preview:
        "밸런스 샤프트 체결 시 죠 간격 조절 필요, 체결 후 진동 확인 필요",
      createdAt: "2026.02.03",
      items: [
        "밸런스 샤프트 체결 시 죠 간격 조절 필요",
        "체결 후 진동 확인 필요",
      ],
    },
  ];

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const parsedPage = Number.parseInt(pageParam ?? "", 10);
    if (Number.isNaN(parsedPage) || parsedPage <= 0) {
      router.replace(`${pathname}?page=1`);
      setCurrentPage(1);
      return;
    }
    setCurrentPage(parsedPage);
  }, [pathname, searchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.replace(`${pathname}?${params.toString()}`);
      setCurrentPage(page);
    },
    [pathname, searchParams],
  );

  return (
    <Column width="100%" gridGap="30px" flexShrink="0">
      <Row width="100%" pt="40px">
        <Font typo="title_1" color="neutral_0">
          Memo
        </Font>
      </Row>
      {memos.length === 0 ? (
        <EmptyMemo />
      ) : (
        <Column width="100%" justifyContent="center" pb="43px" gridGap="30px">
          <Grid gridTemplateColumns="repeat(2, 1fr)" gridGap="30px">
            {memos.map((memo) => (
              <MemoCard
                key={memo.id}
                title={memo.title}
                tag={memo.tag}
                preview={memo.preview}
                createdAt={memo.createdAt}
                onClick={() => setSelectedMemo(memo)}
              />
            ))}
          </Grid>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </Column>
      )}
      <MemoModal
        open={Boolean(selectedMemo)}
        onClose={() => setSelectedMemo(null)}
        title={selectedMemo?.title ?? ""}
        tag={selectedMemo?.tag ?? ""}
        items={selectedMemo?.items ?? []}
      />
    </Column>
  );
}
