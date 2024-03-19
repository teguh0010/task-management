import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { useTodosStore } from './useTodosStore';


export type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
};

interface State {
  categories: Ref<Category[]>;
  selectedCategoryId: Ref<string | null>;
  updateCategories: (newCategories: Category[]) => void;
  clearCategories: () => void;
  setSelectedCategoryId: (id: string) => void;
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([
    // Contoh awal kategori
  ]);
    const selectedCategoryId = ref<string | null>(null); // Add a ref to store the selected category ID


  const updateCategories = (newCategories) => {
    categories.value = newCategories;
  };

  const clearCategories = () => {
    categories.value = [];
  };

  const setSelectedCategoryId = (id: string) => {
    selectedCategoryId.value = id;
  };

  const updateCategoryProgress = (categoryId) => {
    const todosStore = useTodosStore();
    const categoryIndex = categories.value.findIndex(category => category.id === categoryId);
    if (categoryIndex !== -1) {
      const categoryTodos = todosStore.todos.filter(todo => todo.categoryId === categoryId);
      const completedTodos = categoryTodos.filter(todo => todo.completed).length;
      const progress = categoryTodos.length > 0 ? (completedTodos / categoryTodos.length) * 100 : 0;
      categories.value[categoryIndex].progress = progress;
    }
  };

  return {
    categories,
    updateCategories,
    clearCategories,
    setSelectedCategoryId,
    updateCategoryProgress,
    selectedCategoryId
  };
});
