import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AuthError } from 'firebase/auth';
import { firebaseErrorMessages } from 'src/firebase/utils/firebaseErrorMessages';
import populateFirebaseUser from 'src/firebase/utils/populateFirebaseUser';
import initAuth from 'src/firebase/initAuth';
import { invalidHTTPMethod, withAuthUserTokenAPI } from 'utils';

initAuth();

const reserveesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (userId) {
      try {
        const userReservationsSnapshot = await admin
          .firestore()
          .collection('reservations')
          .where('userId', '==', userId)
          .get();
        const userReservations = userReservationsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const reserver = await admin.auth().getUser(userId);
        return res.status(200).send({ sucess: true, userReservations, reserver });
      } catch (err: any) {
        console.log('reservees get error', err);
        return handleError(res, err);
      }
    } else {
      try {
        const dbUsersSnapshot = await admin.firestore().collection('users').get();
        const dbUsers = dbUsersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const dbUsersHash = {};
        dbUsers.forEach((usr) => {
          dbUsersHash[usr.id] = usr;
        });
        const listUsers = await admin.auth().listUsers();
        const users = listUsers.users.map((user) =>
          populateFirebaseUser(user, dbUsersHash[user.uid])
        );
        const reservees = users.filter((user) => user.totalResCount > 0);
        return res.status(200).send({ sucess: true, reservees });
      } catch (err: any) {
        console.log('reservees get error', err);
        return handleError(res, err);
      }
    }
  }

  return invalidHTTPMethod(res, req.method);
};

function handleError(res: NextApiResponse, err: AuthError) {
  return res
    .status(500)
    .send({ message: firebaseErrorMessages[err.code] || 'Fetching users failed' });
}

export default withAuthUserTokenAPI(reserveesHandler);
