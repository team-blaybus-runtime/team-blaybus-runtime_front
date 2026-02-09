import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import type { Attachment } from "../../../type/workflowTypes";
import { Column } from "@/styles/base/BaseComponents";
import { Font } from "@/styles/typo/typography";

const CARD_BG = "#262626";
const CONTROL_BG = "#3A3A3A";
const BORDER = "rgba(255,255,255,0.08)";

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
    <Column gridGap="10px">
      {attachments.map((a, idx) => (
        <Item key={`${a.type}-${idx}`} gridGap="6px">
          <Font typo="label_s" color="alpha_light_70">
            {a.type === "link"
              ? "링크"
              : a.type === "image"
                ? "이미지"
                : "파일"}
          </Font>

          {a.type === "link" ? (
            <Font typo="caption_s" color="alpha_light_80">
              {(a.title ? `${a.title} · ` : "") + a.url}
            </Font>
          ) : a.type === "image" ? (
            <Column gridGap="6px">
              <PreviewImage src={a.dataUrl} alt={a.name} />
              <Font typo="caption_s" color="alpha_light_80">
                {a.name}
                {typeof a.size === "number"
                  ? ` (${(a.size / 1024).toFixed(1)}KB)`
                  : ""}
              </Font>
            </Column>
          ) : (
            <Font typo="caption_s" color="alpha_light_80">
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

const Item = styled(Column)`
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${BORDER};
  background: ${CARD_BG};
`;

const PreviewImage = styled(Img)`
  max-width: 100%;
  max-height: 140px;
  border-radius: 12px;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid ${BORDER};
`;

const RemoveButton = styled(Button)`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${BORDER};
  background: ${CONTROL_BG};
  color: ${colors.alpha_light_90};
  font-size: 13px;
  font-weight: 600;
`;
