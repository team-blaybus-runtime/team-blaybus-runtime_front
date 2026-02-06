"use client";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Div } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

interface StudyCardProps {
  domain: string;
  title: string;
  date: string;
  onClick?: () => void;
}

export default function StudyCard({
  domain,
  title,
  date,
  onClick,
}: StudyCardProps) {
  return (
    <CardWrapper onClick={onClick}>
      <Thumbnail />
      <Column p="16px" gridGap="8px">
        <Badge>
          <Font typo="caption_s" color={colors.neutral_200}>
            {domain}
          </Font>
        </Badge>
        <Font typo="title_2" color={colors.neutral_200}>
          {title}
        </Font>
        <Font typo="caption_s" color={colors.neutral_300}>
          {date}
        </Font>
      </Column>
    </CardWrapper>
  );
}

const CardWrapper = styled(Column)`
  width: 100%;
  border: 1.5px solid ${colors.neutral_900};
  border-radius: 16px;
  padding: 8px;
  cursor: pointer;
  overflow: hidden;
  box-sizing: border-box;
`;

const Thumbnail = styled(Div)`
  width: 100%;
  aspect-ratio: 380 / 253;
  background-color: ${colors.neutral_800};
  border-radius: 8px;
  flex-shrink: 0;
`;

const Badge = styled(Div)`
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 8px;
  background-color: ${colors.neutral_1000};
  border-radius: 24px;
`;
