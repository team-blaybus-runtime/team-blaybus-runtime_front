"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CenterRow, Row } from "@/styles/base/BaseComponents";
import { TextArea } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { SummaryLabel, SummaryValues, UserInfo } from "@/type/user";
import { usePostUserProfileMutation } from "@/queries/users/usePostUserProfileMutation";

const SUMMARY_LABELS: SummaryLabel[] = ["이름", "전공", "학년", "목표"];

export default function UserSummary({ userInfo }: { userInfo?: UserInfo }) {
  const summaryItems = useMemo(
    () => ({
      이름: userInfo?.nickname ?? "",
      전공: userInfo?.major ?? "",
      학년: userInfo?.grade ? String(userInfo.grade) : "",
      목표: userInfo?.goal ?? "",
    }),
    [userInfo],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [summaryValues, setSummaryValues] = useState<SummaryValues>({
    이름: "",
    전공: "",
    학년: "",
    목표: "",
  });

  const { mutate, isPending } = usePostUserProfileMutation();

  const handleChange = (label: SummaryLabel, value: string) => {
    setSummaryValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      const payload = {
        nickname: summaryValues.이름.trim(),
        major: summaryValues.전공.trim(),
        grade: Number(summaryValues.학년 || 0),
        goal: summaryValues.목표.trim(),
      };

      const hasEmptyValue =
        !payload.nickname ||
        !payload.major ||
        !payload.goal ||
        !summaryValues.학년.trim();

      if (hasEmptyValue) {
        return;
      }

      mutate(
        {
          nickname: payload.nickname,
          major: payload.major,
          grade: payload.grade,
          goal: payload.goal,
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
      return;
    }

    setIsEditing(true);
  };

  useEffect(() => {
    setSummaryValues({
      이름: summaryItems.이름,
      전공: summaryItems.전공,
      학년: summaryItems.학년,
      목표: summaryItems.목표,
    });
  }, [summaryItems]);

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
          {SUMMARY_LABELS.map((label) => (
            <CenterRow key={label} gridGap="10px">
              <Font typo="title_2" color="neutral_0">
                {label}
              </Font>
              {isEditing ? (
                <StyledTextArea
                  value={summaryValues[label]}
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
          style={{ cursor: isPending ? "not-allowed" : "pointer" }}
          onClick={isPending ? undefined : handleToggleEdit}
        >
          <Font typo="button_3" color="neutral_0">
            {isEditing ? (isPending ? "저장중" : "완료") : "수정하기"}
          </Font>
        </CenterRow>
      </CenterRow>
    </CenterRow>
  );
}

const StyledTextArea = styled(TextArea).attrs({ typo: "body_1" })`
  width: 120px;
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
