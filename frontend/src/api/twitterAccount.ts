import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { ITwitterAccount, ITTwitterAccount } from 'src/types/twitter';

// ----------------------------------------------------------------------

const URL = endpoints.twitterAccount;

export function useGetTwitterAccount() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const twitterAccounts = data?.result.map((twitterAccount: ITwitterAccount) => ({
      ...twitterAccount,
    }));

    return {
      twitterAccounts: (twitterAccounts as ITwitterAccount[]) || [],
      twitterAccountsLoading: isLoading,
      twitterAccountsError: error,
      twitterAccountsValidating: isValidating,
      twitterAccountsEmpty: !isLoading && !data?.result.length,
    };
  }, [data?.result, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createTwitterAccount(twitterData: ITTwitterAccount) {
  const res = await axiosInstance.post(URL, {
    twitterAccount: twitterData,
  });

  const memoizedValue = {
    result: res?.data.result as ITwitterAccount,
  };

  return memoizedValue;
}

export async function updateTwitterAccount(twitterData: ITTwitterAccount) {
  const res = await axiosInstance.put(URL, {
    twitterAccount: twitterData,
  });

  const memoizedValue = {
    result: res?.data.result as ITwitterAccount,
  };

  return memoizedValue;
}

export async function deleteTwitterAccount(twitterAccountId: string) {
  const data = { twitterAccountId };
  const res = await axiosInstance.delete(URL, { data });

  return res.data;
}
