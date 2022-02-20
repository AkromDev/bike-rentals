import { NextApiResponse } from 'next';
import { firebaseErrorMessages } from 'src/constants/firebaseErrorMessages';
import { AuthError } from 'firebase/auth';

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
