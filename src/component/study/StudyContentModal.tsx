"use client";

import Image from "next/image";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { EngineeringPart } from "@/apis/engineeringApi";
import { useEditStore } from "@/store/useEditStore";

interface StudyContentModalProps {
  objectName: string;
  parts: EngineeringPart[];
}

export default function StudyContentModal({
  objectName,
  parts,
}: StudyContentModalProps) {
  const { selectedPartIndex, setSelectedPartIndex } = useEditStore();

  return (
    <ModalContainer>
      <ModalHeader>
        <Font typo="label_l" color={colors.blue_700}>
          {objectName}
        </Font>
      </ModalHeader>

      <ThumbnailGrid>
        {parts.map((part, i) => (
          <ThumbnailCard
            key={part.partName}
            $selected={selectedPartIndex === i}
            onClick={() => setSelectedPartIndex(selectedPartIndex === i ? null : i)}
          >
            <PartImage
              src={part.imageUrl}
              alt={part.partName}
              width={80}
              height={80}
              unoptimized
            />
          </ThumbnailCard>
        ))}
      </ThumbnailGrid>

      <Divider />

      <DescriptionList>
        {parts.map((part) => (
          <DescriptionItem key={part.partName}>
            <Font typo="label_s" color={colors.neutral_0}>
              {part.partName}
            </Font>
            <Font typo="caption_m" color={colors.neutral_500}>
              {part.content}
            </Font>
          </DescriptionItem>
        ))}
      </DescriptionList>
    </ModalContainer>
  );
}

const ModalContainer = styled(Column)`
  width: 443px;
  max-width: 720px;
  max-height: 100%;
  min-height: 0;
  background-color: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 24px 32px;
  overflow: hidden;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  flex-shrink: 1;
  gap: 20px;
`;

const ModalHeader = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  flex-shrink: 0;
`;

const ThumbnailCard = styled.div<{ $selected?: boolean }>`
  aspect-ratio: 1;
  background-color: ${({ $selected }) => ($selected ? colors.neutral_800 : colors.neutral_900)};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: ${({ $selected }) => ($selected ? `0 0 0 2px ${colors.blue_700}` : "none")};

  &:hover {
    background-color: ${colors.neutral_800};
  }
`;

const PartImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.neutral_800};
  flex-shrink: 0;
`;

const DescriptionList = styled(Column)`
  gap: 20px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.neutral_700};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const DescriptionItem = styled(Column)`
  gap: 6px;
`;

