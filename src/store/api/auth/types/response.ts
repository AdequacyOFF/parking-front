import { BaseResponse } from "../../../../utils/type";

export interface PostLoginResponse extends BaseResponse {
  result: {
    token: string,
    refreshToken: string,
  };
}