import dayjs from 'dayjs';
import { getFilters } from './getFilters';
import admin from './nodeApp';

export const getBikes = async (queries, fetchAll: boolean = false) => {
  const db = admin.firestore();
  let bikesRef = db.collection('bikes');
  const reservationsRef = db.collection('reservations');

  if (
    queries.start &&
    queries.end &&
    !dayjs(queries.start).isValid() &&
    !dayjs(queries.end).isValid()
  ) {
    console.log('invalid adte');
    return null;
  }
  if (!fetchAll) {
    bikesRef = bikesRef.where('available', '==', true);
  }
  if (queries.location) {
    bikesRef = bikesRef.where('location', '==', queries.location);
  }
  if (queries.model) {
    bikesRef = bikesRef.where('model', '==', queries.model);
  }
  if (queries.color) {
    bikesRef = bikesRef.where('color', '==', queries.color);
  }
  try {
    const snapshot = await bikesRef.get();
    let bikes = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const filters = await getFilters();
    const reservationsSnapshot = await reservationsRef.where('status', '==', 'RESERVED').get();
    const reservations = reservationsSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));

    if (reservations.length > 0) {
      bikes = bikes.filter((bike) =>
      reservations.every((res) => {
        if (bike.id !== res.bikeId) {
          return true;
        }

        const overlaping =
          !dayjs(queries.start).isAfter(res.endDate) &&
          !dayjs(queries.end).isBefore(res.startDate);
        return !overlaping;
      })
      );
    }

    return { bikes, filters };
  } catch (err) {
    return null;
  }
};
