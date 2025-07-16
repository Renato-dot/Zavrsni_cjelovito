<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <q-icon name="sports_soccer" size="3rem" color="primary" />
        <div class="text-h4 text-primary q-mt-md">Login</div>
        <div class="text-subtitle2 text-grey-6">Pristupite svom profilu</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="loginForm.email"
            label="Email"
            type="email"
            filled
            :rules="[val => !!val || 'Email is required']"
            icon="email"
          />
          
          <q-input
            v-model="loginForm.password"
            label="Lozinka"
            :type="showPassword ? 'text' : 'password'"
            filled
            :rules="[val => !!val || 'Password is required']"
            icon="lock"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width"
            size="md"
            :loading="authStore.isLoading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-caption text-grey-6">
          Nemate profil?
          <q-btn 
            flat 
            no-caps 
            color="primary" 
            label="Registrirajte se"
            @click="$router.push('/register')"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

async function handleLogin() {
  event.preventDefault();
  if (loginForm.value.email && loginForm.value.password) {
    const result = await authStore.login(loginForm.value)
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Login successful!',
        position: 'top'
      })
      router.push('/')
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Login failed',
        position: 'top'
      })
    }
  } else {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all fields',
      position: 'top'
    })
  }
}
</script>