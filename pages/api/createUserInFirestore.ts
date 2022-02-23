import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import initAuth from 'src/firebase/initAuth';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { uid, email } = req.body;
    await admin.auth().setCustomUserClaims(uid, { role: 'User' });
    await admin.firestore().collection('users').doc(uid).set({ email });
    return res.status(201).send({ success: true });
  } catch (err: any) {
    return handleFirebaseError(res, err);
  }
};

export default handler;
