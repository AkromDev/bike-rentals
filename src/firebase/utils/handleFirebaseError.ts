import { NextApiResponse } from 'next';
import { AuthError } from 'firebase/auth';
import { firebaseErrorMessages } from './firebaseErrorMessages';

const _msg = 'Request failed with status 500';

export default function handleFirebaseError(
  res: NextApiResponse,
  err: AuthError,
  defaultMessage = _msg,
  status: number = 500
) {
  return res
    .status(status)
    .send({ message: firebaseErrorMessages[err.code] || defaultMessage, code: err.code });
}
