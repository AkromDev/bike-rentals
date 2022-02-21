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

      if (!userId || !bikeId) {
        return res.status(400).send({ message: 'Missing fields' });
      }

      if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) {
        return res.status(400).send({ message: 'Reservation range is invalid' });
      }

      if (!(paymentAmount > 0)) {
        return res.status(400).send({ message: 'Invalid payment amount' });
      }
      const reservationsRef = admin.firestore().collection('reservations');

      const reservation = {
        userId,
        bikeId,
        // startDate: admin.firestore.Timestamp.fromDate(dayjs(startDate).toDate()).toDate(),
        // endDate: admin.firestore.Timestamp.fromDate(dayjs(endDate).toDate()).toDate(),
        startDate,
        endDate,
        status: 'RESERVED',
        createdAt: admin.firestore.Timestamp.fromDate(new Date()).toDate(),
      };

      await reservationsRef.add(reservation);

      return res.status(201).send({ success: true });
    } catch (err: any) {
      console.log('reservation err', err);
      return handleFirebaseError(res, err);
    }
  } else if (method === 'PUT') {
    try {
      const { id, bike } = req.body;
      const { model, color, location, imgUrl, priceInUSD, available = false } = bike;

      if (!model || !color || !location || !imgUrl) {
        return res.status(400).send({ message: 'Missing fields' });
      }

      await admin.firestore().collection('bikes').doc(id).update({
        model,
        color,
        location,
        imgUrl,
        priceInUSD,
        available,
      });

      return res.status(201).send({ success: true });
    } catch (err: any) {
      return handleFirebaseError(res, err);
    }
  } else if (method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).send({ message: 'Id missing' });
      }

      await admin.firestore().collection('bikes').doc(id).delete();

      return res.status(201).send({ success: true });
    } catch (err: any) {
      return handleFirebaseError(res, err);
    }
  }

  return invalidHTTPMethod(res, req.method);
};

export default withAuthUserTokenAPI(reservationHandler);
