import { Api } from "@/apis/baseApi";

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
 * GET /engineering/parts?productType={productType}
 */
export async function fetchEngineeringParts(productType: string): Promise<EngineeringPart[]> {
  const { data } = await Api.get<EngineeringPart[]>("/engineering/parts", {
    params: { productType },
  });
  return data;
}
