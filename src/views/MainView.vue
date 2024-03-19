<script setup lang="ts">
import { ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SideBar from '../components/SideBar.vue'
import { useRouter } from 'vue-router'

// Import components for different routes
import Todos from './Todos.vue'
import Profile from './Profile.vue'
import Categories from './Categories.vue'
import { useSlideStore } from './../store/useSlideStore'

// Swiper modules installation
SwiperCore.use([Navigation, Pagination])

const slideStore = useSlideStore()

const router = useRouter()
const swiperRef = ref(null)
const menuOpened = ref(false)

function setSwiperRef(swiper) {
  swiperRef.value = swiper
}

function toggleMenu() {
  if (swiperRef.value) {
    slideStore.toggleSlide()
    menuOpened.value = !menuOpened.value // Toggle state immediately
    swiperRef.value.slideTo(menuOpened.value ? 0 : 1) // Slide based on new state
  }
}

// Adjusted handleSlideChange function to sync with swiper's current slide
function handleSlideChange(swiper) {
  menuOpened.value = swiper.activeIndex === 0 // Update based on activeIndex
}

watch(
  () => slideStore.isSlideOpen,
  (newVal) => {
    if (swiperRef.value) {
      swiperRef.value.slideTo(newVal ? 0 : 1)
      menuOpened.value = newVal
    }
  }
)
</script>

<template>
  <div>
    <swiper class="swiper" :class="{ 'bg-blue-950': menuOpened }" slides-per-view="auto" :initial-slide="1" :resistance-ratio="0" @swiper="setSwiperRef" @slide-change="handleSlideChange">
      <swiper-slide class="menu">
        <div>
          <SideBar />
        </div>
      </swiper-slide>
      <swiper-slide class="content-container">
        <span :class="menuOpened ? 'button-padding' : 'menu-button2'" class="material-symbols-outlined text-gray-600" @click="toggleMenu"> menu </span>
        <div class="menu-button" :class="{ opened: menuOpened }" @click="toggleMenu">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        <!-- <Todos /> -->
        <router-view></router-view>
        <!-- Use Vue Router to render appropriate component based on route -->
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100vh;
  position: relative;
  transition-property: transform;
}

.swiper {
  .menu,
  .menu {
    width: 320px;
    background-color: #2c8dfb !important;
    color: #fff;
  }
  .menu-button2 {
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
    font-size: 30px;
  }
}
.button-padding {
  top: 40px;
  position: absolute;
  left: 20px;
  cursor: pointer;
  font-size: 30px;
}
</style>
