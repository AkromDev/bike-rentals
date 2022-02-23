import admin from './nodeApp';

export const updateFilters = async (addedFilters: Record<string, string>) => {
  const filtersRef = admin.firestore().collection('filters');
  const filtersSnp = await filtersRef.limit(1).get();
  const filters = filtersSnp.docs[0].data() || {};
  const filterId = filtersSnp.docs[0].id;

  Object.keys(addedFilters).forEach((category) => {
    if (filters[category]) {
      filters[category] = [...filters[category], addedFilters[category]];
    } else {
      filters[category] = [addedFilters[category]];
    }
  });

  await filtersRef.doc(filterId).update(filters);
};
