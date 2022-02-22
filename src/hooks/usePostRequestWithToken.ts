import { useCallback, useState } from 'react';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import axios, { Method } from 'axios';
import { useAuthUser } from 'next-firebase-auth';

export default function usePostRequestWithToken(addUserId = false) {
  const [error, setError] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const authUser = useAuthUser();
  const postRequestWithToken = useCallback(
    async (url: string, data: Record<string, any>, method: Method = 'POST') => {
      setError(null);
      setLoading(true);
      try {
        const idToken = await authUser.getIdToken();
        await axios({
          url,
          method,
          data: addUserId ? { ...data, userId: authUser.uid } : data,
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      } catch (err: any) {
        setError(err.response.data);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    },
    [authUser]
  );

  return { postRequestWithToken, loading, error };
}
