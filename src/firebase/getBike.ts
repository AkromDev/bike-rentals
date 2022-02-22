import admin from './nodeApp';

export const getBike = async (bikeId: string) => {
  const db = admin.firestore();
  const bikesRef = db.collection('bikes');

  if (!bikeId) {
    return null;
  }

  try {
    const snapshot = await bikesRef.doc(bikeId).get();
    const bike = { ...snapshot.data(), id: snapshot.id };

    return bike;
  } catch (err) {
    return null;
  }
};
