import { useCallback, useState } from 'react';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

export default function usePostRequestWithToken() {
  const auth = getAuth(getApp());
  const [error, setError] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const postRequestWithToken = useCallback(
    async (url: string, body: Record<string, any>) => {
      setError(null);
      setLoading(true);
      try {
        const idToken = (await auth.currentUser?.getIdToken()) || '';
        await axios.post(url, body, {
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
