import { Method } from 'axios';
import * as admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getBikes } from 'src/firebase/getBikes';
import initAuth from 'src/firebase/initAuth';
import handleFirebaseError from 'src/firebase/utils/handleFirebaseError';
import invalidHTTPMethod from 'utils/invalidHTTPMethod';
import withAuthUserTokenAPI from 'utils/withAuthUserTokenAPI';

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
      const { model, color, location, imgUrl, priceInUSD, available = false } = req.body;

      if (!model || !color || !location || !imgUrl) {
        return res.status(400).send({ message: 'Missing fields' });
      }

      await admin
        .firestore()
        .collection('bikes')
        .add({
          model,
          color,
          location,
          imgUrl,
          priceInUSD,
          available,
          rating: {
            rateAvg: 0,
            rateCount: 0,
          },
        });
      return res.status(201).send({ success: true });
    } catch (err: any) {
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

export default withAuthUserTokenAPI(bikesHandler);
