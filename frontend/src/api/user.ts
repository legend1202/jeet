import axiosInstance, { endpoints } from 'src/utils/axios';

import { AuthUserType } from 'src/auth/types';

// ----------------------------------------------------------------------

const URL = endpoints.auth.me;

export async function updateUser(userData: AuthUserType) {
  const res = await axiosInstance.put(URL, {
    user: userData,
  });

  const memoizedValue = {
    result: res?.data.result as AuthUserType,
  };

  return memoizedValue;
}
