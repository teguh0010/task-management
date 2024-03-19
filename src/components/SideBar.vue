<script setup lang="ts">
import { signOut, User } from '@firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from './../db/index'
import { useTodosStore } from './../store/useTodosStore'
import { useSlideStore } from './../store/useSlideStore'

// Swiper modules installation

const slideStore = useSlideStore()

const store = useTodosStore()

const router = useRouter()

const user = auth.currentUser as User
const photoUrl = user.photoURL as string

function toggleMenu() {
  slideStore.toggleSlide()
}

const logout = async () => {
  await signOut(auth)
  store.clearTodos()
  router.push('/')
}
</script>
<template>
  <div class="relative bg-blue-950">
    <div class="flex flex-col sm:flex-row sm:justify-around">
      <div class="h-screen w-72 content-container">
        <div class="mx-6 head-conteiner">
          <div class="profile-top-container">
            
            <div class="border-4 border-photo border-indigo-600 rounded-full mb-7">
              <img class="sidebar-profile-photo object-cover rounded-full" :src="photoUrl ? photoUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmLbR6OHvoXjzY5UWbguFvw4HQcKZkfbKP7w&usqp=CAU'" alt="Current profile photo" />
            </div>
            <div>
              <button @click="toggleMenu" class="hanging-button border border-cyan-700 bg-transparent text-gray-200 font-bold p-0 rounded-full w-12 h-12 flex items-center justify-center shadow-sm cursor-pointer">
                        <span class="material-icons pl-2">arrow_back_ios</span>

              </button>
            </div>
          </div>

          <span class="large-text text-gray-300 font-bold">
            {{ user.displayName }}
          </span>
        </div>
        <nav class="mt-5 px-6">
          <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-1 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 text-gray-200 rounded-lg" href="/profile">
            <span class="material-symbols-outlined custom-size"> account_circle </span>
            <span class="mx-4 text-lg custom-font-size"> Profile </span>
            <span class="flex-grow text-right"> </span>
          </a>
          <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-1 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 text-gray-200 rounded-lg" href="/todos">
            <span class="material-symbols-outlined custom-size"> ballot </span>
            <span class="mx-4 text-lg custom-font-size"> Todos </span>
            <span class="flex-grow text-right"> </span>
          </a>

          <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-1 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 text-gray-200 rounded-lg" href="/categories">
            <span class="material-symbols-outlined custom-size"> category </span>
            <span class="mx-4 text-lg custom-font-size"> Categories </span>
            <span class="flex-grow text-right"> </span>
          </a>
        </nav>
        <div class="absolute bottom-0 my-10">
          <a @click="logout" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 flex items-center py-2 px-8" href="#">
            <span class="material-symbols-outlined"> logout </span>
            <span class="mx-4 font-medium"> Logout </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
.large-text {
  font-size: 30px;
}
.head-conteiner {
  padding-top: 10vh;
}
.content-container {
  padding-left: 30px;
}
.custom-size {
  font-size: 26px !important;
}
.custom-font-size {
  font-size: 16px;
}
.sidebar-profile-photo {
  width: 85px !important;
  height: 85px !important;
}
.border-photo {
  width: 100px;
  height: 100px;
  padding: 5px;
}
.hanging-button {
  margin-top: -50px;
  /* position: fixed;
    right: 100px;
    top: 50px; */
}
.profile-top-container {
      display: flex;
    justify-content: space-between;
}
</style>
