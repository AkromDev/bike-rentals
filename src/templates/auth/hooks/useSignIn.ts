import { Auth, UserCredential, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useState, useMemo } from 'react';
import { EmailAndPasswordActionHook } from './types';

export default (auth: Auth): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [loggedInUser, setLoggedInUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setLoggedInUser(user);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: EmailAndPasswordActionHook = [signIn, loggedInUser, loading, error];
  return useMemo<EmailAndPasswordActionHook>(() => resArray, resArray);
};
