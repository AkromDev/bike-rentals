import admin from './nodeApp';

export const getBike = async (bikeId: string) => {
  const db = admin.firestore();
  const bikesRef = db.collection('bikes');

  // const locationsRef = db.collection('locations');

  if (!bikeId) {
    return null;
  }

  try {
    const snapshot = await bikesRef.doc(bikeId).get();
    const bike = snapshot.data();

    return bike;
  } catch (err) {
    return null;
  }
};
