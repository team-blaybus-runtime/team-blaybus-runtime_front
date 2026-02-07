"use client";

import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { StudyComponent } from "@/apis/studyApi";

interface StudyContentModalProps {
  open: boolean;
  onClose: () => void;
  objectName: string;
  components: StudyComponent[];
}

export default function StudyContentModal({
  open,
  onClose,
  objectName,
  components,
}: StudyContentModalProps) {
  if (!open) return null;

  return (
    <ModalContainer>
      <ModalHeader>
        <Font typo="label_l" color={colors.blue_700}>
          {objectName}
        </Font>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </ModalHeader>

      <ThumbnailGrid>
        {components.map((comp) => (
          <ThumbnailCard key={comp.componentId}>
            {comp.thumbnailUrl ? (
              <Img
                src={comp.thumbnailUrl}
                alt={comp.componentName}
                width="100%"
                height="100%"
                style={{ objectFit: "contain" }}
              />
            ) : (
              <PlaceholderIcon>
                <Font typo="caption_s" color={colors.neutral_700}>
                  {comp.componentName.charAt(0)}
                </Font>
              </PlaceholderIcon>
            )}
          </ThumbnailCard>
        ))}
      </ThumbnailGrid>

      <Divider />

      <DescriptionList>
        {components.map((comp) => (
          <DescriptionItem key={comp.componentId}>
            <Font typo="label_s" color={colors.neutral_0}>
              {comp.componentName}
              {comp.description && getKoreanName(comp.componentName) && (
                <> ({getKoreanName(comp.componentName)})</>
              )}
            </Font>
            {comp.description && (
              <Font typo="caption_m" color={colors.neutral_500}>
                {comp.description}
              </Font>
            )}
          </DescriptionItem>
        ))}
      </DescriptionList>
    </ModalContainer>
  );
}

const KOREAN_NAMES: Record<string, string> = {
  Base: "베이스",
  "Base Joint": "베이스 관절",
  "Shoulder Joint": "어깨 관절",
  "Upper Arm Link": "상부 링크",
  "Elbow Joint": "팔꿈치 관절",
  "Forearm Link": "하부 링크",
  "Wrist Joint": "손목 관절",
  "End Effector Mount": "엔드 이펙터 마운트",
};

function getKoreanName(name: string): string | null {
  return KOREAN_NAMES[name] ?? null;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 5L5 15M5 5l10 10"
        stroke="#969696"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

const CloseButton = styled(Button)`
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  flex-shrink: 0;
`;

const ThumbnailCard = styled.div`
  aspect-ratio: 1;
  background-color: ${colors.neutral_900};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.neutral_800};
  }
`;

const PlaceholderIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.neutral_900};
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
  gap: 8px;
`;
