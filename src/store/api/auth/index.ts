import { rootApi } from '..'; 
import { LoginAdminPostParams,LoginUserPostParams } from './types/request';
import { PostLoginResponse } from './types/response';

// Экспортируем authApi и useLoginMutation
export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<PostLoginResponse, LoginAdminPostParams>({
      query: (credentials: LoginAdminPostParams) => ({
        url: '/api/admin/login',
        method: 'POST',
        data: credentials
      }),
    }),
    userLogin: build.mutation<PostLoginResponse, LoginUserPostParams>({
      query: (credentials: LoginUserPostParams) => ({
        url: '/api/users/login',
        method: 'POST',
        data: credentials
      }),
    }),
  }),
  overrideExisting: false,
});


export const { useAdminLoginMutation,
               useUserLoginMutation } = authApi;