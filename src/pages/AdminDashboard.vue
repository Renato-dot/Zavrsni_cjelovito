<template>
  <q-page padding class="flex flex-center column">
    <div class="text-h4 q-mb-md">Dobrodošli, administrator!</div>
    <q-btn label="Logout" color="negative" @click="handleLogout" />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

function handleLogout() {
  localStorage.removeItem('adminToken')
  $q.notify({ type: 'positive', message: 'Odjavljeni ste', position: 'top' })
  router.push('/login')
}
</script>
