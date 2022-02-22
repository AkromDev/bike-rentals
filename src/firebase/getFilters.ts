import admin from './nodeApp';

export const getFilters = async () => {
  const db = admin.firestore();
  try {
    const filterSnapshot = await db.collection('filters').get();
    const filters = filterSnapshot.docs.map((doc) => doc.data());
    return filters[0];
  } catch (err) {
    return null;
  }
};
