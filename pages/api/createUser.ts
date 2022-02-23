import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import initAuth from 'src/firebase/initAuth';
import { withAuthUserTokenAPI } from 'utils';

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
    await admin.firestore().collection('users').doc(uid).set({ email });
    return res.status(201).send({ uid });
  } catch (err: any) {
    console.log({ err });
    return handleFirebaseError(res, err);
  }
};

export default withAuthUserTokenAPI(handler, true);
