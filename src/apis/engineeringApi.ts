import { Api } from "@/apis/baseApi";

export interface EngineeringProductType {
  productTypeDesc: string;
  imageUrl: string;
}

/**
 * 엔지니어링 제품 타입 목록 조회
 * GET /engineering
 */
export async function fetchEngineeringProductTypes(): Promise<EngineeringProductType[]> {
  const { data } = await Api.get<EngineeringProductType[]>("/engineering");
  return data;
}
