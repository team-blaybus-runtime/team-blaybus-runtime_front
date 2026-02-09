"use client";

/**
 * 텍스트 노드: 헤더(제목) + 본문(이미지 → 링크 태그 → 내용) 구조의 다크 카드 형태입니다.
 */

import { Handle, Position, type NodeProps } from "@xyflow/react";
import styled from "styled-components";
import colors from "@/styles/constant/colors";
import { A, Div, Img } from "@/styles/base/BaseStyledTags";
import type { WorkflowNode } from "@/type/workflowTypes";
import type { Attachment } from "@/type/workflowTypes";
import { Column } from "@/styles/base/BaseComponents";

const NODE_BG = "#2F3136";
const HEADER_BG = "#33353A";
const LINK_TAG_BG = "#3c3f44";

function getAttachmentsByType(attachments: Attachment[] = []) {
  const images = attachments.filter(
    (a): a is Attachment & { type: "image" } => a.type === "image",
  );
  const links = attachments.filter(
    (a): a is Attachment & { type: "link" } => a.type === "link",
  );
  const files = attachments.filter(
    (a): a is Attachment & { type: "file" } => a.type === "file",
  );
  return { images, links, files };
}

export default function TextNode({ data, selected }: NodeProps<WorkflowNode>) {
  const { images, links, files } = getAttachmentsByType(data.attachments);
  const hasAttachments =
    images.length > 0 || links.length > 0 || files.length > 0;
  const contentText = (data.content || "").trim();
  const contentPreview =
    contentText.slice(0, 220) + (contentText.length > 220 ? "…" : "");

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

      <NodeHeader>{data.title || "제목 없음"}</NodeHeader>
      <NodeBody>
        {images.length > 0 && (
          <ImageBlock>
            {images.map((a, idx) => (
              <AttachmentImage
                key={`img-${idx}`}
                src={a.dataUrl}
                alt={a.name}
              />
            ))}
          </ImageBlock>
        )}
        {links.length > 0 && (
          <LinkTagList>
            {links.map((a, idx) => (
              <LinkTag
                key={`link-${idx}`}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={a.url}
              >
                {a.title ? a.title : a.url}
              </LinkTag>
            ))}
          </LinkTagList>
        )}
        {files.length > 0 && (
          <FileList>
            {files.map((a, idx) => (
              <CaptionText key={`file-${idx}`}>📄 {a.name}</CaptionText>
            ))}
          </FileList>
        )}
        {hasAttachments && contentPreview ? (
          <ContentBlock>
            <BodyText>{contentPreview}</BodyText>
          </ContentBlock>
        ) : contentPreview ? (
          <BodyText>{contentPreview}</BodyText>
        ) : null}
      </NodeBody>
    </Card>
  );
}

const Card = styled(Div)<{ $selected: boolean }>`
  width: 260px;
  min-height: 50px;
  border-radius: 12px;
  overflow: hidden;
  border: ${({ $selected }) =>
    $selected ? `2px solid ${colors.alpha_light_40}` : "none"};
  background: ${NODE_BG};
  position: relative;
  color: ${colors.white};

  .react-flow__handle {
    background: ${colors.alpha_light_50};
    border: 1px solid ${colors.alpha_light_20};
  }
`;

const NodeHeader = styled.div`
  background: ${HEADER_BG};
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.white};
  line-height: 1.3;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const NodeBody = styled(Column)`
  padding: 12px 14px;
  gap: 10px;
  background: ${NODE_BG};
`;

const ImageBlock = styled(Column)`
  gap: 8px;
  width: 100%;
`;

const AttachmentImage = styled(Img)`
  width: 100%;
  max-height: 140px;
  border-radius: 8px;
  object-fit: contain;
  background: ${colors.alpha_dark_20};
`;

const LinkTagList = styled(Column)`
  gap: 6px;
`;

const LinkTag = styled(A)`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${LINK_TAG_BG};
  font-size: 13px;
  color: ${colors.white};
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  &:hover {
    color: ${colors.alpha_light_90};
  }
`;

const FileList = styled(Column)`
  gap: 4px;
`;

const ContentBlock = styled(Column)`
  gap: 4px;
`;

const ContentLabel = styled.span`
  font-size: 12px;
  color: ${colors.alpha_light_60};
`;

const BodyText = styled.div`
  font-size: 13px;
  color: ${colors.white};
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CaptionText = styled.span`
  font-size: 12px;
  color: ${colors.alpha_light_50};
`;
