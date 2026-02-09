"use client";

/**
 * 링크 추가: 제목(선택) + URL 입력 + "추가" 버튼
 * (섹션 제목/카드 박스는 Inspector에서 감싸줌)
 */

import { useState } from "react";
import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button, Input } from "@/styles/base/BaseStyledTags";
import type { Attachment } from "@/type/workflowTypes";
import { Font } from "@/styles/typo/typography";

export default function AddLinkForm({
  onAdd,
}: {
  onAdd: (a: Attachment) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <Form>
      <StyledInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <StyledInput
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
      />
      <AddButton
        type="button"
        onClick={() => {
          const trimmed = url.trim();
          if (!trimmed) return;
          onAdd({
            type: "link",
            url: trimmed,
            title: title.trim() || undefined,
          });
          setTitle("");
          setUrl("");
        }}
      >
        추가
      </AddButton>
    </Form>
  );
}

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledInput = styled(Input).attrs({ typo: "caption_s" })`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid ${colors.neutral_700};
  border-radius: 8px;
  background: ${colors.neutral_900};
  color: ${colors.neutral_0};
`;

const AddButton = styled(Button).attrs({ typo: "caption_s" })`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: ${colors.neutral_800};
  color: ${colors.neutral_0};
`;
