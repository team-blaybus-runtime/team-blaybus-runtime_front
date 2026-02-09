/**
 * 워크플로우 첨부 이미지 압축: 리사이즈 + JPEG 품질 조정으로 요청 크기 감소 (413 방지)
 */

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.78;

export function compressImageFile(file: File): Promise<{ dataUrl: string; name: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;
      let w = width;
      let h = height;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          w = MAX_DIMENSION;
          h = Math.round((height * MAX_DIMENSION) / width);
        } else {
          h = MAX_DIMENSION;
          w = Math.round((width * MAX_DIMENSION) / height);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      const size = Math.round((dataUrl.length * 3) / 4);

      resolve({
        dataUrl,
        name: file.name.replace(/\.(png|gif|webp)$/i, ".jpg") || file.name,
        size,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
