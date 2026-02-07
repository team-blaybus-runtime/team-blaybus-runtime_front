"use client";
import styled from "styled-components";

import { CenterRow } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";

const Pagination = ({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1);
  const noPrevPages = currentPage <= 1;
  const noNextPages = currentPage >= lastPage;

  const handlePageChange = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const nextPageGroup = () => {
    if (!noNextPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const prevPageGroup = () => {
    if (!noPrevPages) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <CenterRow gridGap="8px">
      <ArrowButton disabled={noPrevPages} onClick={prevPageGroup}>
        <Img width="20px" height="20px" src="/icons/common/pageLeft.svg" />
      </ArrowButton>
      <CenterRow gridGap="8px">
        {pageNumbers.map((number, idx) => (
          <NumberButton
            key={idx}
            onClick={() => handlePageChange(number)}
            bg={number === currentPage ? "blue_700" : "black"}
          >
            <Font typo="body_2" color="neutral_0">
              {number}
            </Font>
          </NumberButton>
        ))}
      </CenterRow>
      <ArrowButton disabled={noNextPages} onClick={nextPageGroup}>
        <Img width="20px" height="20px" src="/icons/common/pageRight.svg" />
      </ArrowButton>
    </CenterRow>
  );
};

export default Pagination;

const ArrowButton = styled(Button)`
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const NumberButton = styled(Button)`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
