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
  if (method === 'POST') {
    try {
      const { userId, bikeId, startDate, endDate, paymentAmount, model } = req.body;

      if (!userId || !bikeId || !model) {
        return res.status(400).send({ message: 'User id missing' });
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
        model,
        paymentAmount,
      };

      await reservationsRef.add(reservation);
      await userRef.update({
        activeResCount: activeResCount + 1,
        totalResCount: totalResCount + 1,
      });

      return res.status(201).send({ success: true });
    } catch (err: any) {
      console.log('reser error', err);
      return handleFirebaseError(res, err);
    }
  } else if (method === 'PUT') {
    try {
      const { userId, reservationId, nextStatus, rate, bikeId } = req.body;

      if (!['COMPLETED', 'CANCELLED'].includes(nextStatus)) {
        return res.status(400).send({ message: `Invalid status: ${nextStatus}` });
      }

      if (!bikeId || !userId || !reservationId) {
        return res.status(400).send({ message: 'Missing fields' });
      }

      const userRef = admin.firestore().collection('users').doc(userId);
      const bikeRef = admin.firestore().collection('bikes').doc(bikeId);
      const userSnp = await userRef.get();
      const { activeResCount = 0 } = userSnp.data();

      const data = {
        status: nextStatus,
      };
      let bikeRating = null;
      if (nextStatus === 'COMPLETED' && rate > 0) {
        data.userRate = rate;
        const bikeSnp = await bikeRef.get();
        const { rating } = bikeSnp.data();
        if (!rating) {
          bikeRating = {
            rateAvg: rate,
            rateCount: 1,
          };
        } else {
          const newRateCount = rating.rateCount + 1;
          const oldRatingTotal = rating.rateAvg * rating.rateCount;
          const newAvgRating = (oldRatingTotal + rate) / newRateCount;

          bikeRating = {
            rateAvg: newAvgRating,
            rateCount: newRateCount,
          };
        }
      }

      const bikeUpdatedData = {
        available: true,
      };
      if (bikeRating) {
        bikeUpdatedData.rating = bikeRating;
      }
      await admin.firestore().collection('reservations').doc(reservationId).update(data);
      await admin.firestore().collection('bikes').doc(bikeId).update(bikeUpdatedData);

      await userRef.update({
        activeResCount: activeResCount - 1,
      });

      return res.status(201).send({ success: true });
    } catch (err: any) {
      console.log('reservation update error');
      return handleFirebaseError(res, err);
    }
  }

  return invalidHTTPMethod(res, req.method);
};

export default withAuthUserTokenAPI(reservationHandler);
