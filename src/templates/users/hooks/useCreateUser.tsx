import { useCallback, useMemo } from 'react';
import { Role } from 'src/common-types';
import usePostRequestWithToken from 'src/hooks/usePostRequestWithToken';

export type PostActionHook<M> = [M, boolean, Record<string, any> | null];
export type CreateUserHook = PostActionHook<
  (email: string, password: string, role: Role, displayName?: string) => Promise<void>
>;

export default function useCreateUser(): CreateUserHook {
  const { postRequestWithToken, loading, error } = usePostRequestWithToken();

  const createUser = useCallback(
    async (email: string, password: string, role: Role = 'User', displayName?: string) =>
      postRequestWithToken('/api/createUser', { email, password, role, displayName }),
    [postRequestWithToken]
  );

  return useMemo(() => {
    const resArray: CreateUserHook = [createUser, loading, error];
    return resArray;
  }, [createUser, loading, error]);
}
