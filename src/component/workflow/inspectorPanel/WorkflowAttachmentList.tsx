/**
 * 첨부 목록: 노드의 링크/이미지/파일 메타를 표시합니다.
 */

import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button, Div, Img } from "@/styles/base/BaseStyledTags";
import type { Attachment } from "../../../type/workflowTypes";
import { Column } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

type WorkflowAttachmentListProps = {
  attachments: Attachment[];
  onRemoveAttachment: (index: number) => void;
};

export default function WorkflowAttachmentList({
  attachments,
  onRemoveAttachment,
}: WorkflowAttachmentListProps) {
  if (!attachments.length) {
    return (
      <Font typo="caption_s" color="alpha_light_60">
        아직 첨부가 없어요.
      </Font>
    );
  }

  return (
    <Column gridGap="8px">
      {attachments.map((a, idx) => (
        <Item key={`${a.type}-${idx}`} gridGap="5px">
          <Font typo="label_s" color="alpha_light_90">
            {a.type === "link"
              ? "링크"
              : a.type === "image"
                ? "이미지"
                : "파일"}
          </Font>
          {a.type === "link" ? (
            <Font typo="caption_s" color="alpha_light_70">
              {(a.title ? `${a.title} · ` : "") + a.url}
            </Font>
          ) : a.type === "image" ? (
            <Column gridGap="5px">
              <PreviewImage src={a.dataUrl} alt={a.name} />
              <Font typo="caption_s" color="alpha_light_70">
                {a.name}
                {typeof a.size === "number"
                  ? ` (${(a.size / 1024).toFixed(1)}KB)`
                  : ""}
              </Font>
            </Column>
          ) : (
            <Font typo="caption_s" color="alpha_light_70">
              {a.name}
              {typeof a.size === "number" ? ` (${a.size}B)` : ""}
            </Font>
          )}
          <RemoveButton type="button" onClick={() => onRemoveAttachment(idx)}>
            제거
          </RemoveButton>
        </Item>
      ))}
    </Column>
  );
}

const Item = styled(Column).attrs({ typo: "caption_s" })`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
`;

const PreviewImage = styled(Img)`
  max-width: 100%;
  max-height: 120px;
  border-radius: 8px;
  object-fit: contain;
  background: ${colors.alpha_dark_20};
`;

const RemoveButton = styled(Button).attrs({ typo: "button_3" })`
  margin-top: 8px;
  padding: 6px 8px;
  border-radius: 10px;
  border: 1px solid ${colors.alpha_light_10};
  background: #0b1220;
  color: ${colors.alpha_light_90};
`;
