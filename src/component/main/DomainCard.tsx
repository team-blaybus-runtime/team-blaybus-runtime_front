"use client";

import styled from "styled-components";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

type CardState = "default" | "select" | "disselect";

interface DomainCardProps {
  name: string;
  image?: string;
  state: CardState;
  onClick: () => void;
}

export default function DomainCard({
  name,
  image,
  state,
  onClick,
}: DomainCardProps) {
  return (
    <CardWrapper onClick={onClick}>
      {image ? (
        <CardImage src={image} alt={name} draggable="false" />
      ) : (
        <Placeholder />
      )}
      {state === "disselect" && <DarkOverlay />}
      <GradientOverlay />
      <DomainName
        typo="label_s"
        color={state === "disselect" ? colors.neutral_300 : colors.neutral_0}
      >
        {name}
      </DomainName>
      {state === "select" && (
        <CheckIcon src="/icons/common/check.svg" alt="selected" />
      )}
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  position: relative;
  width: 191px;
  height: 191px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
`;

const CardImage = styled(Img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${colors.neutral_800};
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  pointer-events: none;
`;

const DomainName = styled(Font)`
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 1;
`;

const CheckIcon = styled(Img)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  z-index: 1;
`;
