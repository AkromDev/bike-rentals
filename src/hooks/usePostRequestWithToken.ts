import { useCallback, useState } from 'react';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import axios, { Method } from 'axios';

export default function usePostRequestWithToken(addUserId = false) {
  const auth = getAuth(getApp());
  const [error, setError] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postRequestWithToken = useCallback(
    async (url: string, data: Record<string, any>, method: Method = 'POST') => {
      setError(null);
      setLoading(true);
      try {
        const idToken = await auth.currentUser?.getIdToken();
        await axios({
          url,
          method,
          data: addUserId ? { ...data, userId: auth.currentUser?.uid } : data,
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
    [auth.currentUser]
  );

  return { postRequestWithToken, loading, error };
}
