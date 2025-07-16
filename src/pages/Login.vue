<template>
  <q-page class="flex flex-center bg-grey-1">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90vw">
      <q-card-section class="text-center">
        <q-icon name="sports_soccer" size="3rem" color="primary" />
        <div class="text-h4 text-primary q-mt-md">Login</div>
        <div class="text-subtitle2 text-grey-6">Pristupite svom profilu</div>
      </q-card-section>

      <q-card-section>
        <q-form ref="loginFormRef" @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="loginForm.userField"
            :label="loginForm.isAdmin ? 'Username' : 'Email'"
            :type="loginForm.isAdmin ? 'text' : 'email'"
            filled
            :rules="loginForm.isAdmin
              ? [val => !!val || 'Username is required']
              : [val => !!val || 'Email is required']"
            :icon="loginForm.isAdmin ? 'account_circle' : 'email'"
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

          <q-toggle
            v-model="loginForm.isAdmin"
            label="Prijava kao administrator"
            color="primary"
          />

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
  userField: '',   // email ili username
  password: '',
  isAdmin: false
})

const showPassword = ref(false)
const loginFormRef = ref(null)

async function handleLogin() {
  const valid = loginFormRef.value.validate()
  if (!valid) {
    $q.notify({
      type: 'negative',
      message: 'Molimo ispunite sva polja ispravno',
      position: 'top'
    })
    return
  }

  const payload = loginForm.value.isAdmin
    ? { username: loginForm.value.userField, password: loginForm.value.password, isAdmin: true }
    : { email: loginForm.value.userField, password: loginForm.value.password, isAdmin: false }

  const result = await authStore.login(payload)

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Login uspješan!',
      position: 'top'
    })
    router.push('/')
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Greška prilikom prijave',
      position: 'top'
    })
  }
}
</script>
