import {rootApi} from '..';
import {LoginPostParams} from './types/request';
import {
  PostLoginResponse
} from './types/response';

const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<PostLoginResponse, LoginPostParams>({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        data
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation
} = authApi;
