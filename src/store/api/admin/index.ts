import { rootApi } from '..';
import { objectToParamString } from '../../../utils/params';
import {
  CreatePromotionPostParams,
  PromotionsGetParams,
  UpdatePromotionPostParams,
  RegisterUserParams,
} from './types/request';
import {
  GetPromotionByIdResponse,
  GetPromotionsResponse,
  RegisterUserResponse,
} from './types/response';


interface Place {
  placeId: number;
  ownerId: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  createdAt: string;
}

interface GetPlacesResponse {
  errorCode: number;
  message: string;
  result: {
    allPlaces: Place[];
    total: number;
  };
}

interface CreatePlaceParams {
  ownerId: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
}

interface UpdatePlaceParams extends CreatePlaceParams {
  placeId: number;
}

// Типы для запросов и ответов, связанных с топливом
interface GetFuelVolumeResponse {
  errorCode: number;
  message: string;
  result: {
    minFuelVolume: number;
  };
}

interface CreateParkingResponse {
  errorCode: number;
  message: string;
  result?: any;
}


// Добавьте это в начало файла, где определены другие типы
 export interface UserData {
  id: string;
  phoneNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  parkingSpace?: string;
  cars?: CarData[]; // Добавляем массив автомобилей
}

 export interface CarData {
  id?: string;
  mark: string;
  number: string;
  region: string;
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
    getUser: build.query<{
      errorCode: number;
      message: string;
      result: UserData & { cars?: CarData[] };
    }, void>({
      query: () => ({
        url: '/api/users/me',
      }),
    }),

    // Обновление данных пользователя
    updateUser: build.mutation<void, {
      firstName: string;
      lastName: string;
      patronymic: string;
      phoneNumber: string;
    }>({
      query: (data) => ({
        method: 'PUT',
        url: '/api/users/me',
        body: data,
      }),
    }),

    createParking: build.mutation<CreateParkingResponse, { count: number }>({
      query: (params) => ({
        method: 'POST',
        url: '/api/place/createParking',
        data: { count: params.count },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getPlaces: build.query<GetPlacesResponse, { limit: number; offset: number }>({
      query: (params) => ({
        url: `/api/place/getParking?limit=${params.limit}&offset=${params.offset}`,
      }),
    }),

    createPlace: build.mutation<void, CreatePlaceParams>({
      query: (params) => ({
        method: 'POST',
        url: '/api/places',
        body: params,
      }),
    }),

    updatePlace: build.mutation<void, UpdatePlaceParams>({
      query: (params) => ({
        method: 'PUT',
        url: `/api/places/${params.placeId}`,
        body: params,
      }),
    }),

    deletePlace: build.mutation<void, number>({
      query: (id) => ({
        method: 'DELETE',
        url: `/api/places/${id}`,
      }),
    }),
    
    registerUser: build.mutation<RegisterUserResponse, RegisterUserParams>({
      query: (params) => ({
        method: 'POST',
        url: '/api/admin/userRegister',
        data: {
          phoneNumber: params.phoneNumber,
          firstName: params.firstName,
          lastName: params.lastName,
          patronymic: params.patronymic,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
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
  useRegisterUserMutation,
  useLazyGetUserQuery, 
  useUpdateUserMutation,
  useCreateParkingMutation,
  useCreatePlaceMutation,
  useDeletePlaceMutation,
  useLazyGetPlacesQuery,
  useUpdatePlaceMutation,
} = adminApi;
