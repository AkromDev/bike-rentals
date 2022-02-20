import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AuthError } from 'firebase/auth';
import withAuthUserTokenAPI from 'utils/withAuthUserTokenAPI';
import { firebaseErrorMessages } from 'src/constants/firebaseErrorMessages';
import populateFirebaseUser from 'utils/populateFirebaseUser';
import initAuth from '../../utils/initAuth';

initAuth();

const fetchUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map(populateFirebaseUser);
    return res.status(200).send({ users });
  } catch (err: any) {
    return handleError(res, err);
  }
};

function handleError(res: NextApiResponse, err: AuthError) {
  return res
    .status(500)
    .send({ message: firebaseErrorMessages[err.code] || 'Fetching users failed' });
}

export default withAuthUserTokenAPI(fetchUsers);
