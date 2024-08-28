import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IOwner, ITOwner } from 'src/types/owner';

// ----------------------------------------------------------------------

const URL = endpoints.owner;

export function useGetOnwers() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const owners = data?.result.map((owner: IOwner) => ({
      ...owner,
    }));

    return {
      owners: (owners as IOwner[]) || [],
      ownersLoading: isLoading,
      ownersError: error,
      ownersValidating: isValidating,
      ownersEmpty: !isLoading && !data?.result.length,
    };
  }, [data?.result, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createOwner(ownerData: ITOwner) {
  const res = await axiosInstance.post(URL, {
    owner: ownerData,
  });

  const memoizedValue = {
    result: res?.data.result as IOwner,
  };

  return memoizedValue;
}

export async function updateOwner(ownerData: IOwner) {
  const res = await axiosInstance.put(URL, {
    owner: ownerData,
  });

  const memoizedValue = {
    result: res?.data.result as IOwner,
  };

  return memoizedValue;
}

export async function deleteOwner(ownerId: string) {
  const data = { ownerId };
  const res = await axiosInstance.delete(URL, { data });

  return res.data;
}
