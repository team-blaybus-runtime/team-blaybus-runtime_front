"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { CenterRow, Row } from "@/styles/base/BaseComponents";
import { TextArea } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

export default function UserSummary() {
  const summaryItems = [
    { label: "전공", value: "기계공학과" },
    { label: "학년", value: "2학년" },
    { label: "목표", value: "분해도 이해하기" },
  ] as const;

  const [isEditing, setIsEditing] = useState(false);
  const [summaryValues, setSummaryValues] = useState<Record<string, string>>(
    summaryItems.reduce(
      (acc, item) => ({ ...acc, [item.label]: item.value }),
      {} as Record<string, string>,
    ),
  );

  const handleChange = (label: string, value: string) => {
    setSummaryValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <CenterRow width="100%" height="140px" py="30px" flexShrink="0">
      <CenterRow
        width="100%"
        height="80px"
        px="80px"
        bg="neutral_900"
        borderRadius="20px"
        justifyContent="space-between"
      >
        {/* 학생 정보 관련 부분 */}
        <Row width="100%" gridGap="30px" alignItems="center">
          {summaryItems.map(({ label }) => (
            <CenterRow key={label} gridGap="10px">
              <Font typo="title_2" color="neutral_0">
                {label}
              </Font>
              {isEditing ? (
                <StyledTextArea
                  value={summaryValues[label] ?? ""}
                  onChange={(event) => handleChange(label, event.target.value)}
                />
              ) : (
                <Font typo="body_1" color="neutral_0">
                  {summaryValues[label]}
                </Font>
              )}
            </CenterRow>
          ))}
        </Row>
        <CenterRow
          width="80px"
          height="34px"
          bg="neutral_600"
          borderRadius="8px"
          style={{ cursor: "pointer" }}
          onClick={handleToggleEdit}
        >
          <Font typo="button_3" color="neutral_0">
            {isEditing ? "완료" : "수정하기"}
          </Font>
        </CenterRow>
      </CenterRow>
    </CenterRow>
  );
}

const StyledTextArea = styled(TextArea).attrs({ typo: "body_1" })`
  height: 32px;
  min-height: 32px;
  max-height: 32px;
  padding: 0 10px;
  border-radius: 3px;
  background-color: ${colors.neutral_800};
  color: ${colors.neutral_0};
  overflow: hidden;
  resize: none;
`;
