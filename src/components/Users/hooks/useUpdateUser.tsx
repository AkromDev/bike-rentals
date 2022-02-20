import { useCallback, useMemo } from 'react';
import { Role } from 'src/common-types';
import usePostRequestWithToken from 'src/hooks/usePostRequestWithToken';

export type PostActionHook<M> = [M, boolean, Record<string, any> | null];
export type UpdateUserHook = PostActionHook<
  (id: string, email: string, password: string, role: Role, displayName?: string) => Promise<void>
>;

export default function useUpdateUser(): UpdateUserHook {
  const { postRequestWithToken, loading, error } = usePostRequestWithToken();

  const createUser = useCallback(
    async (
      id: string,
      email: string,
      password: string,
      role: Role = 'User',
      displayName?: string
    ) => postRequestWithToken('/api/updateUser', { id, email, password, role, displayName }),
    [postRequestWithToken]
  );

  return useMemo(() => {
    const resArray: UpdateUserHook = [createUser, loading, error];
    return resArray;
  }, [createUser, loading, error]);
}
