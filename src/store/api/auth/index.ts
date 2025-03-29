import { rootApi } from '..'; 
import { LoginPostParams } from './types/request';
import { PostLoginResponse } from './types/response';

// Экспортируем authApi и useLoginMutation
export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<PostLoginResponse, LoginPostParams>({
      query: (credentials: LoginPostParams) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;