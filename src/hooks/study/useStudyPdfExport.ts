import { useCallback, useState } from "react";
import type { RefObject } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Message } from "@/type/aiChat";
import type { MemoItem } from "@/type/memo";

type UseStudyPdfExportParams = {
  viewerRef: RefObject<HTMLDivElement | null>;
  memos: MemoItem[];
  messages: Message[];
  title: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDateTime = (date: Date) =>
  date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const stripIndent = (html: string) => html.replace(/^\s+/gm, "").trim();

export default function useStudyPdfExport({
  viewerRef,
  memos,
  messages,
  title,
}: UseStudyPdfExportParams) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = useCallback(async () => {
    if (!viewerRef.current || isExporting) return;
    setIsExporting(true);

    let wrapper: HTMLDivElement | null = null;
    try {
      let viewerImage = "";
      const targetCanvas = viewerRef.current.querySelector("canvas");
      if (targetCanvas instanceof HTMLCanvasElement) {
        try {
          viewerImage = targetCanvas.toDataURL("image/png");
        } catch {
          viewerImage = "";
        }
      }
      if (!viewerImage) {
        const viewerCanvas = await html2canvas(viewerRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        });
        viewerImage = viewerCanvas.toDataURL("image/png");
      }

      wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.style.top = "0";
      const pageWidth = 794;
      const pagePadding = 28;

      wrapper.style.width = `${pageWidth}px`;
      wrapper.style.padding = `${pagePadding}px`;
      wrapper.style.backgroundColor = "#f5f6f8";
      wrapper.style.color = "#111111";
      wrapper.style.fontFamily = "Pretendard, Arial, sans-serif";
      wrapper.style.boxSizing = "border-box";
      document.body.appendChild(wrapper);

      const memoItems =
        memos.length > 0
          ? memos
              .map(
                (memo) => `
          <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;background:#ffffff;">
            <div style="font-weight:700;font-size:16px;margin-bottom:6px;">${escapeHtml(
              memo.title,
            )}</div>
            <div style="font-size:14px;line-height:1.6;color:#333333;white-space:pre-wrap;">${escapeHtml(
              memo.content,
            )}</div>
            <div style="font-size:12px;color:#777777;margin-top:8px;">${escapeHtml(
              memo.updatedAt,
            )}</div>
          </div>
        `,
              )
              .join("")
          : `<div style="font-size:14px;color:#777777;margin-bottom:20px;">작성된 메모가 없습니다.</div>`;

      const chatItems =
        messages.length > 0
          ? messages
              .map((msg) => {
                const label = msg.role === "user" ? "나" : "AI";
                const bubbleColor = msg.role === "user" ? "#e9f0ff" : "#f3f4f6";
                return `
          <div style="margin-bottom:12px;">
            <div style="font-size:12px;font-weight:600;color:#555555;margin-bottom:6px;">${label}</div>
            <div style="background:${bubbleColor};border-radius:12px;padding:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
              ${escapeHtml(msg.content)}
            </div>
          </div>
        `;
              })
              .join("")
          : `<div style="font-size:14px;color:#777777;">대화 기록이 없습니다.</div>`;

      wrapper.innerHTML = stripIndent(`
        <div style="background:#ffffff;border-radius:20px;padding:32px;box-shadow:0 8px 24px rgba(15,23,42,0.12);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div>
              <div style="font-size:26px;font-weight:700;letter-spacing:-0.3px;">${escapeHtml(
                title,
              )}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:6px;">${formatDateTime(
                new Date(),
              )}</div>
            </div>
            <div style="display:flex;gap:8px;">
              <div style="background:#eef2ff;color:#4338ca;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;">메모 ${
                memos.length
              }개</div>
              <div style="background:#ecfeff;color:#0f766e;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;">대화 ${
                messages.length
              }개</div>
            </div>
          </div>
          <div style="height:1px;background:#e5e7eb;margin:8px 0 24px;"></div>
          <div style="margin-bottom:28px;">
            <div style="font-size:16px;font-weight:700;margin-bottom:12px;">현재 뷰어 이미지</div>
            <div style="background:#f8fafc;border-radius:16px;padding:16px;border:1px solid #e5e7eb;">
              <img src="${viewerImage}" alt="viewer" style="width:100%;max-height:420px;object-fit:contain;border-radius:12px;display:block;" />
            </div>
          </div>
          <div style="margin-bottom:28px;">
            <div style="font-size:16px;font-weight:700;margin-bottom:12px;">학습 메모</div>
            ${memoItems}
          </div>
          <div>
            <div style="font-size:16px;font-weight:700;margin-bottom:12px;">AI 대화 기록</div>
            ${chatItems}
          </div>
        </div>
      `);

      const docCanvas = await html2canvas(wrapper, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const imgData = docCanvas.toDataURL("image/png");
      const pdfWidth = 595.28;
      const imgHeight = (docCanvas.height * pdfWidth) / docCanvas.width;
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: [pdfWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

      const safeTitle = title
        .replace(/[\\/:*?"<>|]+/g, "_")
        .replace(/\s+/g, "_");
      pdf.save(`${safeTitle}.pdf`);
    } finally {
      if (wrapper?.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
      setIsExporting(false);
    }
  }, [isExporting, memos, messages, title, viewerRef]);

  return { exportPdf, isExporting };
}
