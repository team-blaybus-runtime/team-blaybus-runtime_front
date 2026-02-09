"use client";

/**
 * 이미지 첨부: "이미지 선택" 버튼 + 도움말 텍스트 (섹션 제목은 Inspector에서 표시)
 * 선택 시 리사이즈·압축하여 413 Request Entity Too Large 방지
 */

import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button, Input } from "@/styles/base/BaseStyledTags";
import type { Attachment } from "@/type/workflowTypes";
import { compressImageFile } from "@/component/workflow/utils/imageCompression";
import { Font } from "@/styles/typo/typography";
import { CenterColumn } from "@/styles/base/BaseComponents";

export default function AddImageForm({
  onAdd,
}: {
  onAdd: (a: Attachment) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      // 같은 파일 재선택 가능하게 먼저 초기화
      e.target.value = "";

      setIsCompressing(true);
      try {
        const { dataUrl, name, size } = await compressImageFile(file);
        onAdd({
          type: "image",
          name,
          dataUrl,
          size,
        });
      } catch (err) {
        console.error("Image compression failed:", err);
      } finally {
        setIsCompressing(false);
      }
    },
    [onAdd],
  );

  return (
    <>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
      />
      <CenterColumn width="100%" gridGap="12px">
        <SelectButton
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isCompressing}
          aria-busy={isCompressing}
        >
          {isCompressing ? "압축 중..." : "이미지 선택"}
        </SelectButton>

        <Font typo="caption_s" color="neutral_500">
          JPG, PNG, GIF, WebP 등
        </Font>
      </CenterColumn>
    </>
  );
}

const HiddenInput = styled(Input)`
  display: none;
`;

const SelectButton = styled(Button)`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: ${colors.neutral_800};
  color: ${colors.neutral_0};
`;
