import axios from 'axios';
import {PostLoginResponse} from '../../store/api/auth/types/response';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: false,
});

const removeStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const refreshToken = async (options?: {reload?: boolean}) => {
  try {
    const r = await axiosInstance.post<PostLoginResponse>('/admin/refreshToken');

    if (r.data) {
      localStorage.setItem('accessToken', r.data.result.token);
      localStorage.setItem('refreshToken', r.data.result.refreshToken);
    }
  } catch (e) {
    removeStorage();

    if (options && options.reload !== false) {
      window.location.reload();
    }
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.endsWith('/admin/refreshToken')) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    } else {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    const config = error.config;
    if (
      error.response.status === 401
    ) {
      if (!config._isRetry) {
        config._isRetry = true;
        await refreshToken();
        return axiosInstance.request(config);
      } else {
        removeStorage();
        window.location.reload();
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
