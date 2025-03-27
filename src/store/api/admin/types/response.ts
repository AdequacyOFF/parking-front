import {BaseResponse} from '../../../../utils/type';
import { IPromotion, IPromotionDetail } from './models';


export interface GetPromotionsResponse extends BaseResponse {
  result: {
    promotions: IPromotion[];
    total: number;
  };
}

export interface GetPromotionByIdResponse extends BaseResponse {
  result: IPromotionDetail
}

export interface UpdateFuelVolumeResponse {
  errorCode: number;
  message: string;
  result: {};
}