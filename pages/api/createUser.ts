import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import { AuthError } from 'firebase/auth';
import withAuthUserTokenAPI from 'utils/withAuthUserTokenAPI';
import { firebaseErrorMessages } from 'src/constants/firebaseErrorMessages';
import initAuth from '../../utils/initAuth';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { displayName, password, email, role } = req.body;

    if (!displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    const { uid } = await admin.auth().createUser({
      displayName,
      password,
      email,
    });
    await admin.auth().setCustomUserClaims(uid, { role });

    return res.status(201).send({ uid });
  } catch (err: any) {
    console.log({ err });
    return handleError(res, err);
  }
};

function handleError(res: NextApiResponse, err: AuthError) {
  return res
    .status(500)
    .send({ message: firebaseErrorMessages[err.code] || 'User creation failed' });
}

export default withAuthUserTokenAPI(handler, true);
