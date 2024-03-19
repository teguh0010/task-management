import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';

export type Todo = {
  id: string;
  completed: boolean;
  text: string;
  userId: string;
  createdAt: Date;
  categoryId: string;
};

interface State {
  todos: Ref<Todo[]>;
  updateTodos: (newTodos: Todo[]) => void;
  clearTodos: () => void;
}

export const useTodosStore = defineStore('todos', (): State => {
  const todos = ref<Todo[]>([]);

  const updateTodos = (newTodos: Todo[]) => {
  todos.value = newTodos;
    // todos.value = newTodos.sort((a, b) => (b.completed ? -1 : 1));
  };

  const clearTodos = () => {
    todos.value = [];
  };

  return { todos, updateTodos, clearTodos };
});
