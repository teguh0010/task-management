<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { auth, storage } from '../db' // Adjust the import path according to your project structure
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { useToast } from 'primevue/usetoast'
import { useSlideStore } from './../store/useSlideStore'

const toast = useToast()

const slideStore = useSlideStore()

const isSlideOpen = ref(slideStore.isSlideOpen)

const user = ref(auth.currentUser)
const fullName = ref(user.value?.displayName || '')
const email = ref(user.value?.email || '')
const profilePictureUrl = ref(user.value?.photoURL || '')
const pictureUploadLoading = ref(false)
const updateLoading = ref(false)

const fileInput = ref(null)

watch(
  () => slideStore.isSlideOpen,
  (newVal) => {
    isSlideOpen.value = newVal
  }
)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelected = async (event: Event) => {
  pictureUploadLoading.value = true
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) {
    pictureUploadLoading.value = false
    return
  }
  const fileRef = storageRef(storage, `profile-pictures/${user.value?.uid}/${file.name}`)
  try {
    const snapshot = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(snapshot.ref)
    profilePictureUrl.value = url
  } catch (error) {
    console.error('Error uploading file: ', error)
  }
  pictureUploadLoading.value = false
}

const updateUserProfile = async () => {
  if (!user.value) return
  updateLoading.value = true
  try {
    await updateProfile(user.value, {
      displayName: fullName.value,
      photoURL: profilePictureUrl.value,
    })
    toast.add({ severity: 'success', detail: 'Profile Updated', life: 2000 })
  } catch (error) {
    console.error('Error updating profile: ', error)
  }
  updateLoading.value = false
}

onMounted(() => {
  if (!user.value) return
  fullName.value = user.value.displayName || ''
  email.value = user.value.email || ''
  profilePictureUrl.value = user.value.photoURL || ''
})
</script>

<template>
  <div :class="isSlideOpen ? 'is-page-slide' : 'is-page-back'" class="container px-4 bg-white">
    <div class="flex justify-center items-center min-h-screen">
      <div class="space-y-6 form-container">
        <input ref="fileInput" @change="onFileSelected" type="file" class="hidden" />

        <div class="flex justify-center gap-4">
          <div class="flex justify-center items-center shrink-0 w-26 h-26 relative cursor-pointer" @click="triggerFileInput">
            <LoadingSpinner v-if="pictureUploadLoading" />
            <div v-else class="relative">
              <div class="border-4 border-indigo-600 rounded-full">
                <img class="h-24 w-24 object-cover rounded-full" :src="profilePictureUrl || 'https://example.com/default-profile.jpg'" alt="Current profile photo" />
              </div>
              <div class="icon-edit-border">
                <span class="material-symbols-outlined">edit</span>
              </div>
            </div>
          </div>
        </div>
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="fullname" class="sr-only">Full Name</label>
            <input id="fullname" name="fullname" type="text" autocomplete="off" required v-model="fullName" class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Full Name" />
          </div>

          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="off" required v-model="email" disabled class="mt-5 relative block w-full bg-gray-200 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Email address" />
          </div>

          <div class="py-12">
            <button @click="updateUserProfile" class="group disabled:bg-gray-400 relative flex w-full justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Update Profiletesst</button>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
.large-text {
  font-size: 30px;
}
.icon-edit-border {
  position: absolute;
  right: 5px;
  bottom: 5px;
  background: blue;
  border-radius: 25px;
  width: 30px;
  height: 30px;
  border: 3px white solid;
}

.material-symbols-outlined {
  font-size: 19px;
  color: white;
  padding-left: 3px;
  padding-top: 1px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-container {
  width: 80vw;
}

.is-page-slide {
  height: 92vh;
  margin-top: 30px;
  border-radius: 25px;
  overflow: hidden;
}

.is-page-back {
  height: 100%;
}
.profile-list-container {
  max-height: calc(100vh - 240px); 
  overflow-y: 
}
</style>
