import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import initAuth from 'src/firebase/initAuth';
import { withAuthUserTokenAPI } from 'utils';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body;
    await admin.auth().deleteUser(id);
    return res.status(204).send({});
  } catch (err: any) {
    return handleFirebaseError(res, err, 'User deletion failed');
  }
};

export default withAuthUserTokenAPI(handler, true);
