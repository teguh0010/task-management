import { query, where, getDocs, orderBy } from 'firebase/firestore';
import { categoriesRef, auth } from '../db';
import { Category, useCategoriesStore } from '../store/useCategoriesStore';

export const getCategories = async () => {
  const store = useCategoriesStore();

  const categoriesQuery = query(
    categoriesRef,
    where('userId', '==', auth.currentUser?.uid),
    orderBy('createdAt', 'asc')
  );

  const categoriesSnapshot = await getDocs(categoriesQuery);

  let newCategories: Category[] = [];

  categoriesSnapshot.forEach((doc) => {
    newCategories = [
      {
        id: doc.id,
        ...(doc.data() as Pick<
          Category,
          'name' | 'userId' | 'createdAt'
        >),
      },
      ...newCategories,
    ];
  });

  store.updateCategories(newCategories);
};
