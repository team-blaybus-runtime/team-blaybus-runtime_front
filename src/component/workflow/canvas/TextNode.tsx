"use client";

/**
 * 텍스트 노드: 카드 형태로 내용과 첨부 미리보기를 표시합니다.
 */

import { Handle, Position, type NodeProps } from "@xyflow/react";
import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { A, Div, Img } from "@/styles/base/BaseStyledTags";
import type { WorkflowNode } from "@/type/workflowTypes";
import { Font } from "@/styles/typo/typography";
import { Column } from "@/styles/base/BaseComponents";

export default function TextNode({ data, selected }: NodeProps<WorkflowNode>) {
  return (
    <Card $selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 10 }}
      />

      <Font typo="label_m" color="alpha_light_90">
        {data.title || "제목 없음"}
      </Font>
      <Font
        typo="body_2"
        color="alpha_light_70"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {(data.content || "").slice(0, 220)}
        {(data.content || "").length > 220 ? "…" : ""}
      </Font>
      {data.attachments?.length ? (
        <AttachmentList>
          {data.attachments.map((a, idx) =>
            a.type === "image" ? (
              <AttachmentImage
                key={`img-${idx}`}
                src={a.dataUrl}
                alt={a.name}
              />
            ) : a.type === "link" ? (
              <AttachmentLink
                key={`link-${idx}`}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={a.url}
              >
                {a.title ? `${a.title}` : a.url}
              </AttachmentLink>
            ) : (
              <Div key={`file-${idx}`}>
                <Font typo="caption_s" color="alpha_light_50">
                  📄 {a.name}
                </Font>
              </Div>
            ),
          )}
        </AttachmentList>
      ) : null}
    </Card>
  );
}

const Card = styled(Div)<{ $selected: boolean }>`
  width: 260px;
  border-radius: 12px;
  border: ${({ $selected }) =>
    $selected
      ? `2px solid ${colors.alpha_light_50}`
      : `1px solid ${colors.alpha_light_10}`};
  background: ${colors.neutral_1000};
  padding: 12px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
  position: relative;
  color: ${colors.alpha_light_90};

  .react-flow__handle {
    background: ${colors.alpha_light_50};
    border: 1px solid ${colors.alpha_light_10};
  }
`;

const AttachmentList = styled(Column)`
  margin-top: 10px;
  gap: 8px;
`;

const AttachmentImage = styled(Img)`
  width: 100%;
  max-height: 72px;
  border-radius: 8px;
  object-fit: cover;
  background: ${colors.alpha_dark_20};
`;

const AttachmentLink = styled(A).attrs({ typo: "caption_s" })`
  color: ${colors.alpha_light_50};
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
