import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------
if (typeof window !== 'undefined' && sessionStorage.getItem('accessToken')) {
  axios.defaults.headers.common.Authorization = sessionStorage.getItem('accessToken');
}

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { params: { ...config } });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  owner: '/api/owner',
  strategy: '/api/strategy',
  twitterAccount: '/api/twitteraccount',
  upload: '/api/upload',
  user: '/api/user',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
};
