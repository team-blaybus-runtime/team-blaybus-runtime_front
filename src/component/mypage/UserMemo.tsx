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
import { useFetchUserMemosQuery } from "@/queries/users/memos/useFetchUserMemos";

export default function UserMemo() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMemo, setSelectedMemo] = useState<MemoItem | null>(null);
  const lastPage = 7;

  const { data: memos } = useFetchUserMemosQuery();

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
      {memos?.length === 0 ? (
        <EmptyMemo />
      ) : (
        <Column width="100%" justifyContent="center" pb="43px" gridGap="30px">
          <Grid gridTemplateColumns="repeat(2, 1fr)" gridGap="30px">
            {memos?.map((memo) => (
              <MemoCard
                key={memo.memoId}
                title={memo.title}
                productTypeDesc={memo.productTypeDesc ?? ""}
                content={memo.content}
                updatedAt={memo.updatedAt}
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
        productTypeDesc={selectedMemo?.productTypeDesc ?? ""}
        content={selectedMemo?.content ?? ""}
      />
    </Column>
  );
}
