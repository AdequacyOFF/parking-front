import { rootApi } from '..';
import { objectToParamString } from '../../../utils/params';
import {
  CreatePromotionPostParams,
  PromotionsGetParams,
  UpdatePromotionPostParams,
} from './types/request';
import {
  GetPromotionByIdResponse,
  GetPromotionsResponse,
} from './types/response';

// Типы для запросов и ответов, связанных с топливом
interface GetFuelVolumeResponse {
  errorCode: number;
  message: string;
  result: {
    minFuelVolume: number;
  };
}

interface UpdateFuelVolumeParams {
  volume: number;
}

const adminApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    // Получение списка акций
    getPromotions: build.query<GetPromotionsResponse, PromotionsGetParams>({
      query: (params) => {
        const p = { limit: 10, ...params };
        return {
          url: `/promotions/${
            typeof p === 'object' ? objectToParamString(p) : p
          }`,
        };
      },
      providesTags: ['Promotion'],
    }),

    // Получение акции по ID
    getPromotionById: build.query<GetPromotionByIdResponse, string>({
      query: (id) => ({
        url: `/promotions/${id}`,
      }),
    }),

    // Создание акции
    createPromotion: build.mutation<void, CreatePromotionPostParams>({
      query: (params) => {
        const formData = new FormData();
        formData.append('title', params.title);
        formData.append('description', params.description);
        formData.append('shortDescription', params.shortDescription);
        formData.append('startDate', params.startDate);
        formData.append('endDate', params.endDate);
        formData.append('file', params.file);
        if (params.url) {
          formData.append('url', params.url);
        }

        return {
          method: 'POST',
          url: '/admin/promotions',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
          formData: true,
        };
      },
      invalidatesTags: ['Promotion'],
    }),

    // Обновление акции
    updatePromotion: build.mutation<void, UpdatePromotionPostParams>({
      query: (params) => {
        const formData = new FormData();
        formData.append('title', params.title);
        formData.append('description', params.description);
        formData.append('shortDescription', params.shortDescription);
        formData.append('startDate', params.startDate);
        formData.append('endDate', params.endDate);
        formData.append('file', params.file);
        if (params.url) {
          formData.append('url', params.url);
        }

        return {
          method: 'PUT',
          url: `/admin/promotions/${params.id}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
          formData: true,
        };
      },
      invalidatesTags: ['Promotion'],
    }),

    // Удаление акции
    deletePromotion: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: `/admin/promotions/${id}`,
      }),
      invalidatesTags: ['Promotion'],
    }),

    // Получение текущего минимального объема топлива
    getFuelVolume: build.query<GetFuelVolumeResponse, void>({
      query: () => ({
        url: '/orders/fuel/volume',
      }),
      providesTags: ['FuelVolume'],
    }),

    // Обновление минимального объема топлива
    updateFuelVolume: build.mutation<void, UpdateFuelVolumeParams>({
      query: (params) => {

        return {
          method: 'PUT', // Убедитесь, что метод корректен (PUT или POST)
          url: '/admin/fuel/volume',
          data: {
            volume: params.volume
          }, // Тело запроса в формате JSON
          headers: {
            'Content-Type': 'application/json', // Указываем тип содержимого
          },
        };
      },
      invalidatesTags: ['FuelVolume'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetPromotionsQuery,
  useLazyGetPromotionByIdQuery,
  useDeletePromotionMutation,
  useUpdatePromotionMutation,
  useCreatePromotionMutation,
  useLazyGetFuelVolumeQuery,
  useUpdateFuelVolumeMutation,
} = adminApi;
