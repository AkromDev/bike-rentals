import axios from 'axios';
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

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user.user, {
        displayName,
      });
      await axios.post('/api/createUserInFirestore', {
        uid: user.user.uid,
        email: user.user.email,
      });
      if (options && options.sendEmailVerification && user.user) {
        await sendEmailVerification(user.user, options.emailVerificationOptions);
      }
      setRegisteredUser(user);
    } catch (err) {
      console.log('signup error', err);
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: EmailAndPasswordActionHook = [signUp, registeredUser, loading, error];
  return useMemo<EmailAndPasswordActionHook>(() => resArray, resArray);
};
