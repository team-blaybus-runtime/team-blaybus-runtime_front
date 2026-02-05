"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import { Row } from "@/styles/base/BaseComponents";
import { Button, Img, Span } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

type PaginationItem = number | "ellipsis";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  className?: string;
};

const makeRange = (start: number, end: number) => {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
};

const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationItem[] => {
  const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;

  if (totalPages <= totalPageNumbers) {
    return makeRange(1, totalPages);
  }

  const startPages = makeRange(1, boundaryCount);
  const endPages = makeRange(totalPages - boundaryCount + 1, totalPages);

  const siblingsStart = Math.max(
    Math.min(
      currentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1,
    ),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(
      currentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2,
    ),
    totalPages - boundaryCount - 1,
  );

  const items: PaginationItem[] = [];
  items.push(...startPages);

  if (siblingsStart > boundaryCount + 2) {
    items.push("ellipsis");
  } else if (boundaryCount + 1 < siblingsStart) {
    items.push(...makeRange(boundaryCount + 1, siblingsStart - 1));
  }

  items.push(...makeRange(siblingsStart, siblingsEnd));

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    items.push("ellipsis");
  } else if (siblingsEnd + 1 <= totalPages - boundaryCount) {
    items.push(...makeRange(siblingsEnd + 1, totalPages - boundaryCount));
  }

  items.push(...endPages);
  return items;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const pages = useMemo(
    () =>
      getPaginationRange(
        safeCurrentPage,
        totalPages,
        siblingCount,
        boundaryCount,
      ),
    [safeCurrentPage, totalPages, siblingCount, boundaryCount],
  );

  const handlePageChange = (page: number) => {
    if (disabled || page === safeCurrentPage) return;
    onPageChange(page);
  };

  return (
    <PaginationRow className={className}>
      <IconButton
        aria-label="이전 페이지"
        disabled={disabled || safeCurrentPage === 1}
        onClick={() => handlePageChange(safeCurrentPage - 1)}
      >
        <ArrowIcon
          src="/icons/common/rightArrow.svg"
          alt="prev"
          $direction="left"
        />
      </IconButton>

      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <Ellipsis key={`ellipsis-${index}`}>…</Ellipsis>
        ) : (
          <PageButton
            key={item}
            aria-current={item === safeCurrentPage ? "page" : undefined}
            $active={item === safeCurrentPage}
            disabled={disabled}
            onClick={() => handlePageChange(item)}
          >
            <Font typo="label_m" color={item === safeCurrentPage ? "neutral_0" : "neutral_500"}>
              {item}
            </Font>
          </PageButton>
        ),
      )}

      <IconButton
        aria-label="다음 페이지"
        disabled={disabled || safeCurrentPage === totalPages}
        onClick={() => handlePageChange(safeCurrentPage + 1)}
      >
        <ArrowIcon
          src="/icons/common/rightArrow.svg"
          alt="next"
          $direction="right"
        />
      </IconButton>
    </PaginationRow>
  );
}

const PaginationRow = styled(Row)`
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PageButton = styled(Button)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? colors.blue_700 : "transparent")};
  border: ${({ $active }) =>
    $active ? "none" : `1px solid ${colors.neutral_800}`};
`;

const IconButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${colors.neutral_800};
`;

const ArrowIcon = styled(Img)<{ $direction: "left" | "right" }>`
  width: 20px;
  height: 20px;
  transform: ${({ $direction }) =>
    $direction === "left" ? "rotate(180deg)" : "none"};
`;

const Ellipsis = styled(Span)`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${colors.neutral_500};
`;
