"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";
import DomainCard from "@/component/main/DomainCard";
import { saveUserStudyHistory, fetchUserStudyHistories } from "@/apis/study";
import {
  EngineeringProductType,
  fetchEngineeringProductTypes,
} from "@/apis/engineering";

interface NewStudyModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

/** productTypeDesc → URL-safe objectId 변환 */
function toObjectId(desc: string): string {
  return desc.replace(/_/g, "-").toLowerCase();
}

/** productTypeDesc → 표시 이름 변환 */
function toDisplayName(desc: string): string {
  return desc.replace(/_/g, " ");
}

export default function NewStudyModal({ open, onClose, onCreated }: NewStudyModalProps) {
  const router = useRouter();
  const [domains, setDomains] = useState<EngineeringProductType[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const cardRowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedDomain(null);
      return;
    }
    fetchEngineeringProductTypes()
      .then(setDomains)
      .catch(() => {});
  }, [open]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = cardRowRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = cardRowRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 3) hasDragged.current = true;
    el.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    const el = cardRowRef.current;
    if (el) el.style.cursor = "grab";
  }, []);

  if (!open) return null;

  const getCardState = (domainId: string) => {
    if (!selectedDomain) return "default" as const;
    if (selectedDomain === domainId) return "select" as const;
    return "disselect" as const;
  };

  const handleCardClick = (desc: string) => {
    if (hasDragged.current) return;
    setSelectedDomain((prev) => (prev === desc ? null : desc));
  };

  const handleStudy = async () => {
    if (!selectedDomain) return;
    const displayName = toDisplayName(selectedDomain);
    try {
      await saveUserStudyHistory({
        productTypeDesc: selectedDomain,
        title: `${displayName} 구조 학습`,
        viewInfo: {
          partId: 1,
          position: [0, 0, 0],
          geometry: [1, 1, 1],
          color: "#6366f1",
          roughnessMultiplier: 1,
          metalnessMultiplier: 1,
          envMapMultiplier: 1,
          roughness: 0.4,
          metalness: 0.6,
          envMapIntensity: 1,
          camera: {
            position: [3, 2, 3],
            target: [0, 0, 0],
            fov: 45,
          },
          renderSettings: {
            bloom: { intensity: 0.5, threshold: 0.8, smoothing: 0.9 },
            ao: { radius: 0.5, intensity: 1.5 },
            lighting: { keyLightIntensity: 2.0, ambientIntensity: 0.2 },
          },
        },
      });
      const histories = await fetchUserStudyHistories();
      const latest = histories.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )[0];
      onCreated?.();
      onClose();
      if (latest) {
        router.push(`/study/${latest.userStudyHisId}`);
      }
      return;
    } catch {
      // API 실패해도 페이지 이동은 허용
    }
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <Font typo="title_2" color={colors.neutral_100}>
            어떤 기계/장비를 학습하시겠습니까?
          </Font>
          <CloseButton onClick={onClose}>
            <Img
              src="/icons/mypage/modalCancel.svg"
              width="20px"
              height="20px"
              alt="close"
            />
          </CloseButton>
        </HeaderRow>

        <CardRow
          ref={cardRowRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {domains.map((domain) => (
            <DomainCard
              key={domain.productTypeDesc}
              name={toDisplayName(domain.productTypeDesc)}
              image={domain.imageUrl}
              state={getCardState(domain.productTypeDesc)}
              onClick={() => handleCardClick(domain.productTypeDesc)}
            />
          ))}
        </CardRow>

        <FooterRow>
          <StudyButton onClick={handleStudy} $active={!!selectedDomain}>
            <Font
              typo="button_2"
              color={selectedDomain ? colors.neutral_0 : colors.neutral_300}
            >
              학습하기
            </Font>
            <Img
              src="/icons/common/rightArrow.svg"
              width="20px"
              height="20px"
              alt="arrow"
            />
          </StudyButton>
        </FooterRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled(Column)`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: ${colors.alpha_dark_70};
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
`;

const Modal = styled(Column)`
  width: 720px;
  max-width: calc(100% - 48px);
  background-color: ${colors.neutral_1000};
  border-radius: 16px;
  padding: 24px 32px;
  gap: 30px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
`;

const HeaderRow = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow-x: auto;
  cursor: grab;
  user-select: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FooterRow = styled(Row)`
  justify-content: flex-end;
`;

const StudyButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 8px 12px;
  background-color: ${({ $active }) =>
    $active ? colors.blue_700 : colors.neutral_800};
  border: none;
  border-radius: 8px;
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition: background-color 0.2s;
`;
