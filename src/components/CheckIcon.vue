<template>
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" stroke="white" stroke-width="10"
    d="M 20,50 l 20,20 l 40,-40"
    stroke-dasharray="82"
    stroke-dashoffset="82"
    style="animation: draw 0.5s forwards;">
  </path>
</svg>
</template>


<style>
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
