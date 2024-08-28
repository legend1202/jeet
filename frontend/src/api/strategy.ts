import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { ISTRATEGY, ITSTRATEGY } from 'src/types/strategy';

// ----------------------------------------------------------------------

const URL = endpoints.strategy;

export function useGetStrategy() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const strategies = data?.result.map((strategy: ISTRATEGY) => ({
      ...strategy,
    }));

    return {
      strategies: (strategies as ISTRATEGY[]) || [],
      strategiesLoading: isLoading,
      strategiesError: error,
      strategiesValidating: isValidating,
      strategiesEmpty: !isLoading && !data?.result.length,
    };
  }, [data?.result, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createStrategy(strategyData: ITSTRATEGY) {
  const res = await axiosInstance.post(URL, {
    strategy: strategyData,
  });

  const memoizedValue = {
    result: res?.data.result as ISTRATEGY,
  };

  return memoizedValue;
}

export async function updateStrategy(strategyData: ITSTRATEGY) {
  const res = await axiosInstance.put(URL, {
    strategy: strategyData,
  });

  const memoizedValue = {
    result: res?.data.result as ISTRATEGY,
  };

  return memoizedValue;
}

export async function deleteStrategy(strategyId: string) {
  const data = { strategyId };
  const res = await axiosInstance.delete(URL, { data });

  return res.data;
}
