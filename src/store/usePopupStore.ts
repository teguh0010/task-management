// file: usePopupStore.ts
import { defineStore } from 'pinia';

export const usePopupStore = defineStore({
  id: 'popup',
  state: () => ({
    isOpen: false,
  }),
  actions: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
});
