import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AuthError } from 'firebase/auth';
import { firebaseErrorMessages } from 'src/firebase/utils/firebaseErrorMessages';
import populateFirebaseUser from 'src/firebase/utils/populateFirebaseUser';
import initAuth from 'src/firebase/initAuth';
import { withAuthUserTokenAPI } from 'utils';

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
