export interface PromotionsGetParams {
  limit?: number,
  offset?: number
}

export interface CreatePromotionPostParams {
  title: string,
  file: string,
  shortDescription: string,
  startDate: string,
  endDate: string,
  description: string,
  url?: string | null
}

export interface UpdatePromotionPostParams extends CreatePromotionPostParams {
  id: string
}
// Типы для запросов и ответов, связанных с топливом
export interface GetFuelVolumeResponse {
  errorCode: number;
  message: string;
  result: {
    minFuelVolume: number;
  };
}

export interface UpdateFuelVolumeParams {
  volume: number;
}
