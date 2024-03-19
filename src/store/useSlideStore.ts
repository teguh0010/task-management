// src/store/useSlideStore.ts
import { defineStore } from 'pinia';

export const useSlideStore = defineStore('slide', {
  state: () => ({
    isSlideOpen: false,
  }),
  actions: {
    toggleSlide() {
      this.isSlideOpen = !this.isSlideOpen;
    },
  },
});