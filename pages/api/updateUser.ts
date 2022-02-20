import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import handleFirebaseError from 'utils/handleFirebaseError';
import withAuthUserTokenAPI from 'utils/withAuthUserTokenAPI';
import populateFirebaseUser from 'utils/populateFirebaseUser';
import initAuth from '../../utils/initAuth';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    await admin.auth().updateUser(id, { displayName, password, email });
    await admin.auth().setCustomUserClaims(id, { role });
    const user = await admin.auth().getUser(id);

    return res.status(204).send({ user: populateFirebaseUser(user) });
  } catch (err: any) {
    return handleFirebaseError(res, err, 'Updating user failed');
  }
};

export default withAuthUserTokenAPI(handler, true);
