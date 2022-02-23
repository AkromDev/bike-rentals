import { Method } from 'axios';
import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBikes } from 'src/firebase/getBikes';
import initAuth from 'src/firebase/initAuth';
import { updateFilters } from 'src/firebase/updateFilters';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import { invalidHTTPMethod, withAuthUserTokenAPI } from 'utils';

initAuth();

const bikesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: Method | undefined = req.method as Method | undefined;
  if (method === 'GET') {
    try {
      const data = await getBikes({}, true);
      return res.status(200).send(data);
    } catch (err: any) {
      return handleFirebaseError(res, err);
    }
  } else if (method === 'POST') {
    try {
      const {
        model,
        color,
        location,
        imgUrl,
        priceInUSD,
        available = false,
        addedFilters,
      } = req.body;

      if (!model || !color || !location) {
        return res.status(400).send({ message: 'Missing fields' });
      }

      const bike = {
        model,
        color,
        location,
        priceInUSD,
        available,
        rating: {
          rateAvg: 0,
          rateCount: 0,
        },
      };
      if (imgUrl) {
        bike.imgUrl = imgUrl;
      }
      await admin.firestore().collection('bikes').add(bike);
      if (addedFilters) {
        await updateFilters(addedFilters);
      }
      return res.status(201).send({ success: true });
    } catch (err: any) {
      console.log('create bike err', err);
      return handleFirebaseError(res, err);
    }
  } else if (method === 'PUT') {
    try {
      const { id, bike } = req.body;
      const { model, color, location, imgUrl, priceInUSD, available = false, addedFilters } = bike;

      if (!model || !color || !location) {
        return res.status(400).send({ message: 'Missing fields' });
      }

      const bikeUpdated = {
        model,
        color,
        location,
        priceInUSD,
        available,
      };
      if (imgUrl) {
        bikeUpdated.imgUrl = imgUrl;
      }
      await admin.firestore().collection('bikes').doc(id).update(bikeUpdated);
      if (addedFilters) {
        await updateFilters(addedFilters);
      }
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

export default withAuthUserTokenAPI(bikesHandler);
