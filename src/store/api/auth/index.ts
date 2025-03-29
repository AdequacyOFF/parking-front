import { rootApi } from '..'; 
import { LoginPostParams } from './types/request';
import { PostLoginResponse } from './types/response';

// Экспортируем authApi и useLoginMutation
export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<PostLoginResponse, LoginPostParams>({
      query: (credentials: LoginPostParams) => ({
        url: '/api/admin/login',
        method: 'POST',
        data: credentials
      }),
    }),
    userLogin: build.mutation<PostLoginResponse, LoginPostParams>({
      query: (credentials: LoginPostParams) => ({
        url: '/api/admin/login',
        method: 'POST',
        data: credentials
      }),
    }),
  }),
  overrideExisting: false,
});


export const { useAdminLoginMutation,
               useUserLoginMutation } = authApi;