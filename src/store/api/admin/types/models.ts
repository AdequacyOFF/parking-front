export interface IPromotion {
  id: string,
  title: string,
  photo: string,
  shortDescription: string,
  startDate: string,
  endDate: string,
}

export interface IPromotionDetail extends IPromotion {
  description: string,
  url: string,
}