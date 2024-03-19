<script lang="ts" setup>
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@firebase/auth'

import { computed } from '@vue/reactivity'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../db'
import { handleSignInError } from '../utils/auth'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const router = useRouter()

const loading = ref<boolean>(false)
const error = ref<string | undefined>(undefined)

const email = ref<string>('')
const password = ref<string>('')

const buttonDisabled = computed<boolean>(() => !email.value || !password.value)

const clear = () => {
  email.value = ''
  password.value = ''
}

const onSubmit = async () => {
  loading.value = true

  try {
    const res = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    if (res.user && auth.currentUser) {
      router.push('/todos')
    }
  } catch (e) {
    error.value = handleSignInError(e)
    setTimeout(() => (error.value = ''), 2000)
  }

  clear()
  loading.value = false
}

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential.accessToken
    const user = result.user
    router.push('/todos')
  } catch (error) {
    const errorCode = error.code
    const errorMessage = error.message
    const email = error.email
    const credential = GoogleAuthProvider.credentialFromError(error)
    console.error(`Google sign in error ${errorCode}: ${errorMessage}`)
    error.value = handleSignInError(error)
  }
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="mt-8 space-y-6 px-4"
    action="#"
    method="POST"
  >
    <input type="hidden" name="remember" value="true" />

    <div class="-space-y-px rounded-md shadow-sm form-input2">
      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input
          id="email-address"
          name="email"
          type="email"
          autocomplete="off"
          required
          v-model="email"
          class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="Email address"
        />
      </div>

      <div>
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="off"
          v-model="password"
          required
          class="relative mt-5 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          placeholder="Password"
        />
      </div>
    </div>

    <div
      v-if="error"
      class="w-full text-sm bg-red-200 text-red-800 rounded-md px-4 py-2"
    >
      {{ error }}
    </div>

    <button
      type="submit"
      :disabled="buttonDisabled || loading"
      class="group disabled:bg-gray-400 relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span
        v-if="buttonDisabled"
        class="absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <svg
          class="h-5 w-5 text-gray-500 group-hover:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      {{ loading ? 'Loading...' : 'Sign In' }}
    </button>
    <button
      @click="signInWithGoogle"
      class="group relative flex w-full justify-center rounded-full border border-grey bg-white py-3 px-4 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <img
          class="h-8 w-8 object-cover rounded-full"
          :src="'https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png'"
          alt="google-button"
        />
      </span>
      Sign in with google
    </button>
  </form>
  <Toast />
</template>
