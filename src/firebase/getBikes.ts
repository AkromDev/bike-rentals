import admin from './nodeApp';

export const getBikes = async (queries, fetchAll: boolean = false) => {
  const db = admin.firestore();
  let bikesRef = db.collection('bikes');
  const filtersRef = db.collection('filters');
  // const colorsRef = db.collection('colors');
  // const modelsRef = db.collection('models');
  // const locationsRef = db.collection('locations');

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
    const bikes = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    // const colorsSnapshot = await colorsRef.get();
    // const colors = colorsSnapshot.docs.map((doc) => doc.data());

    // const modelSnapshot = await modelsRef.get();
    // const models = modelSnapshot.docs.map((doc) => doc.data());

    const filterSnapshot = await filtersRef.get();
    const filters = filterSnapshot.docs.map((doc) => doc.data());

    return { bikes, filters: filters[0] };
  } catch (err) {
    return null;
  }
};
