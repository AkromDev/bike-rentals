import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import populateFirebaseUser from 'src/firebase/utils/populateFirebaseUser';
import initAuth from 'src/firebase/initAuth';
import { withAuthUserTokenAPI } from 'utils';

initAuth();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id, displayName, password, email, role } = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    await admin.auth().updateUser(id, { displayName, password, email });
    await admin.auth().setCustomUserClaims(id, { role });
    // const user = await admin.auth().getUser(id);

    return res.status(204).send({ sucess: true });
  } catch (err: any) {
    return handleFirebaseError(res, err, 'Updating user failed');
  }
};

export default withAuthUserTokenAPI(handler, true);
