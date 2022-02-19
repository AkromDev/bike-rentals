import { useMemo, useState } from 'react';
import { Auth } from 'firebase/auth';
import axios from 'axios';

export type Role = 'Manager' | 'User';
export type AuthActionHook<M> = [M, boolean, Record<string, any> | null];
export type CreateUserHook = AuthActionHook<
  (email: string, password: string, role: 'Manager' | 'User', displayName?: string) => Promise<void>
>;

export default function useCreateUser(auth: Auth): CreateUserHook {
  const [error, setError] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const createUser = async (
    email: string,
    password: string,
    role: 'Manager' | 'User' = 'User',
    displayName?: string
  ) => {
    setError(null);
    setLoading(true);
    try {
      const idToken = (await auth.currentUser?.getIdToken()) || '';
      await axios.post(
        '/api/createUser',
        {
          email,
          password,
          role,
          displayName,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resArray: CreateUserHook = [createUser, loading, error];
  return useMemo(() => resArray, resArray);
}
