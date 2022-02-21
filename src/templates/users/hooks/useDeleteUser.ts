import { useCallback, useMemo } from 'react';
import usePostRequestWithToken from 'src/hooks/usePostRequestWithToken';
import { PostActionHook } from './useCreateUser';

export type DeleteUserHook = PostActionHook<(id: string) => Promise<void>>;

export default function useDeleteUser(): DeleteUserHook {
  const { postRequestWithToken, loading, error } = usePostRequestWithToken();

  const deleteUser = useCallback(
    async (id: string) => postRequestWithToken('/api/deleteUser', { id }),
    [postRequestWithToken]
  );

  return useMemo(() => {
    const resArray: DeleteUserHook = [deleteUser, loading, error];
    return resArray;
  }, [deleteUser, loading, error]);
}
