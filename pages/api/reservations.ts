import { Method } from 'axios';
import dayjs from 'dayjs';
import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import initAuth from 'src/firebase/initAuth';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import { invalidHTTPMethod, withAuthUserTokenAPI } from 'utils';

initAuth();

const reservationHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: Method | undefined = req.method as Method | undefined;
  if (method === 'GET') {
    // try {
    //   const { userId } = req.query;
    //   const bikesRef = admin.firestore().collection('users').doc(userId);

    //   return res.status(200).send(data);
    // } catch (err: any) {
    //   return handleFirebaseError(res, err);
    // }
  } else if (method === 'POST') {
    try {
      const { userId, bikeId, startDate, endDate, paymentAmount } = req.body;

      if (!userId) {
        return res.status(400).send({ message: 'User id missing' });
      }
      if (!bikeId) {
        return res.status(400).send({ message: 'Bike id missing' });
      }

      if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
        return res.status(400).send({ message: 'Reservation range is invalid' });
      }

      if (!(paymentAmount > 0)) {
        return res.status(400).send({ message: 'Invalid payment amount' });
      }
      const reservationsRef = admin.firestore().collection('reservations');
      const userRef = admin.firestore().collection('users').doc(userId);
      const userSnp = await userRef.get();
      const { totalResCount = 0, activeResCount = 0 } = userSnp.data();

      const reservation = {
        userId,
        bikeId,
        startDate,
        endDate,
        status: 'RESERVED',
        createdAt: admin.firestore.Timestamp.fromDate(new Date()).toDate(),
      };

      await reservationsRef.add(reservation);
      await userRef.update({
        activeResCount: activeResCount + 1,
        totalResCount: totalResCount + 1,
      });

      return res.status(201).send({ success: true });
    } catch (err: any) {
      console.log('reservation err', err);
      return handleFirebaseError(res, err);
    }
  } else if (method === 'PUT') {
    try {
      const { userId, reservationId, nextStatus } = req.body;

      if (!(['COMPLETED', 'CANCELLED'].includes(nextStatus))) {
        return res.status(400).send({ message: `Invalid status: ${nextStatus}` });
      }

      const userRef = admin.firestore().collection('users').doc(userId);
      const userSnp = await userRef.get();
      const { activeResCount = 0 } = userSnp.data();

      await admin.firestore().collection('reservations').doc(reservationId).update({
        status: nextStatus,
      });

      await userRef.update({
        activeResCount: activeResCount - 1,
      });

      return res.status(201).send({ success: true });
    } catch (err: any) {
      console.log('ducccing error');
      return handleFirebaseError(res, err);
    }
  }

  return invalidHTTPMethod(res, req.method);
};

export default withAuthUserTokenAPI(reservationHandler);
