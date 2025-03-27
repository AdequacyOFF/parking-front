import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../../utils/http';

type BaseQueryArgs = {
  baseUrl?: string;
};

const axiosBaseQuery =
  ({ baseUrl }: BaseQueryArgs) =>
  async (config: AxiosRequestConfig) => {
    try {
      const result = await axiosInstance({
        ...config,
        url: baseUrl + config.url!,
      });
      return { data: result.data, meta: { headers: result.headers } };
    } catch (axiosError: any) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          error: err.response?.data || err.message,
        },
      };
    }
  };

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  tagTypes: ['Promotion', 'FuelVolume'],
  endpoints: () => ({}),
});
