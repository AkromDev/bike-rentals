import { Method } from 'axios';
import { useCallback, useMemo } from 'react';
import { Role } from 'src/common-types';
import usePostRequestWithToken from 'src/hooks/usePostRequestWithToken';

export type PostActionHook<M> = [M, boolean, Record<string, any> | null];
export type UpdateBikeHook = PostActionHook<(data: Record<string, any>) => Promise<void>>;

export default function useBikeActionRequest(method: Method = 'POST'): UpdateBikeHook {
  const { postRequestWithToken, loading, error } = usePostRequestWithToken();

  const bikeAction = useCallback(
    async (data) => postRequestWithToken('/api/bikes', data, method),
    [postRequestWithToken]
  );

  return useMemo(() => {
    const resArray: UpdateBikeHook = [bikeAction, loading, error];
    return resArray;
  }, [bikeAction, loading, error]);
}
