"use client";

/**
 * 이미지 첨부 폼: 파일을 읽어 dataUrl로 첨부합니다.
 */

import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button, Div, Input } from "@/styles/base/BaseStyledTags";
import type { Attachment } from "../../../type/workflowTypes";

export default function AddImageForm({
  onAdd,
}: {
  onAdd: (a: Attachment) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onAdd({
          type: "image",
          name: file.name,
          dataUrl,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [onAdd],
  );

  return (
    <Form>
      <Title>사진 첨부</Title>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <SelectButton type="button" onClick={() => inputRef.current?.click()}>
        이미지 선택
      </SelectButton>
      <HelperText>
        JPG, PNG, GIF, WebP 등 (자동 저장·Export JSON에 포함)
      </HelperText>
    </Form>
  );
}

const Form = styled(Div)`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${colors.alpha_light_10};
`;

const Title = styled(Div).attrs({ typo: "label_s" })`
  margin-bottom: 8px;
`;

const HiddenInput = styled(Input)`
  display: none;
`;

const SelectButton = styled(Button).attrs({ typo: "button_3" })`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  background: #0b1220;
  color: ${colors.alpha_light_90};
  width: 100%;
`;

const HelperText = styled(Div).attrs({ typo: "caption_s" })`
  color: ${colors.alpha_light_50};
  margin-top: 6px;
`;
