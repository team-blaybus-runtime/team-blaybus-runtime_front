"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { UserStudyHistory } from "@/apis/studyApi";
import { useEditStore } from "@/store/useEditStore";

interface StudyContentModalProps {
  objectName: string;
  histories: UserStudyHistory[];
}

export default function StudyContentModal({
  objectName,
  histories,
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
        {histories.map((h, i) => (
          <ThumbnailCard
            key={h.userStudyHisId}
            $selected={selectedPartIndex === i}
            onClick={() => setSelectedPartIndex(selectedPartIndex === i ? null : i)}
          >
            <PartPreview
              $color={h.viewInfo.color}
              $width={h.viewInfo.geometry[0]}
              $height={h.viewInfo.geometry[1]}
              $depth={h.viewInfo.geometry[2]}
            />
          </ThumbnailCard>
        ))}
      </ThumbnailGrid>

      <Divider />

      <DescriptionList>
        {histories.map((h) => (
          <DescriptionItem key={h.userStudyHisId}>
            <Font typo="label_s" color={colors.neutral_0}>
              {h.title}
            </Font>
            <PartMeta>
              <Font typo="caption_m" color={colors.neutral_500}>
                Part {h.viewInfo.partId}
              </Font>
              <Font typo="caption_m" color={colors.neutral_500}>
                {new Date(h.updatedAt).toLocaleDateString("ko-KR")}
              </Font>
            </PartMeta>
          </DescriptionItem>
        ))}
      </DescriptionList>
    </ModalContainer>
  );
}

/** viewInfo.geometry 비율로 3D-느낌 박스 렌더 */
function PartPreview({
  $color,
  $width,
  $height,
  $depth,
}: {
  $color: string;
  $width: number;
  $height: number;
  $depth: number;
}) {
  const maxDim = Math.max($width, $height, $depth);
  const w = ($width / maxDim) * 60;
  const h = ($height / maxDim) * 60;

  return (
    <PreviewBox>
      <PreviewShape
        style={{
          width: `${w}%`,
          height: `${h}%`,
          backgroundColor: $color,
          borderRadius: "4px",
          boxShadow: `4px 4px 0px 0px ${$color}66`,
        }}
      />
    </PreviewBox>
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

const PreviewBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewShape = styled.div`
  transition: transform 0.2s;
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

const PartMeta = styled(Row)`
  gap: 12px;
`;
