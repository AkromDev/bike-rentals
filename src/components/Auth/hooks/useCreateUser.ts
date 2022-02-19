import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  AuthError,
} from 'firebase/auth';
import { useState, useMemo } from 'react';
import { CreateUserOptions, EmailAndPasswordActionHook } from './types';

export default (auth: Auth, options?: CreateUserOptions): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [registeredUser, setRegisteredUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const useCreateUser = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user.user, {
        displayName,
      });
      if (options && options.sendEmailVerification && user.user) {
        await sendEmailVerification(user.user, options.emailVerificationOptions);
      }
      setRegisteredUser(user);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: EmailAndPasswordActionHook = [useCreateUser, registeredUser, loading, error];
  return useMemo<EmailAndPasswordActionHook>(() => resArray, resArray);
};
