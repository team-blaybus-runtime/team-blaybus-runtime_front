import { Api } from "@/apis/baseApi";

/** 임시 숨김 부품 (에셋 미준비 등) */
const HIDDEN_PARTS: Record<string, string[]> = {
  v4engine: ["conrodbolt"],
  machinevice: ["guiderail", "pressuresleeve", "visebody"],
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function isPartHidden(productType: string, partName: string): boolean {
  const hidden = HIDDEN_PARTS[normalize(productType)];
  return hidden ? hidden.includes(normalize(partName)) : false;
}

export interface EngineeringProductType {
  productTypeDesc: string;
  imageUrl: string;
}

export interface EngineeringPart {
  partName: string;
  content: string;
  imageUrl: string;
  assetUrl: string;
}

/**
 * 엔지니어링 제품 타입 목록 조회
 * GET /engineering
 */
export async function fetchEngineeringProductTypes(): Promise<EngineeringProductType[]> {
  const { data } = await Api.get<EngineeringProductType[]>("/engineering");
  return data;
}

/**
 * 엔지니어링 부품 목록 조회
 * GET /engineering/parts?productTypeDesc={productTypeDesc}
 */
export async function fetchEngineeringParts(productTypeDesc: string): Promise<EngineeringPart[]> {
  const { data } = await Api.get<EngineeringPart[]>("/engineering/parts", {
    params: { productTypeDesc },
  });
  return data.filter((p) => !isPartHidden(productTypeDesc, p.partName));
}
