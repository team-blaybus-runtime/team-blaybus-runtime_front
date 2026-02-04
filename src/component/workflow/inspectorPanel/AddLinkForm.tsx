"use client";

/**
 * 링크 첨부 폼: 제목/URL을 입력해 첨부 메타를 추가합니다.
 */

import { useState } from "react";
import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button, Div, Input } from "@/styles/base/BaseStyledTags";
import type { Attachment } from "../../../type/workflowTypes";
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
      <Font typo="label_s" color="alpha_light_90">
        링크 추가
      </Font>
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목(선택)"
      />
      <TextInput
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
      />
      <SubmitButton
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
      </SubmitButton>
    </Form>
  );
}

const Form = styled(Div)`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${colors.alpha_light_10};
`;

const TextInput = styled(Input).attrs({ typo: "body_2" })`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  margin-bottom: 8px;
  background: ${colors.alpha_dark_0};
  color: ${colors.alpha_light_90};
`;

const SubmitButton = styled(Button).attrs({ typo: "button_3" })`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  background: ${colors.alpha_dark_0};
  color: ${colors.alpha_light_90};
`;
