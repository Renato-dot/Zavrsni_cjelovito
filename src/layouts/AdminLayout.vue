<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Admin Panel</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header class="text-grey-8">Admin Navigacija</q-item-label>

        <q-item clickable v-ripple @click="goTo('dashboard')">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="goTo('tereni')">
          <q-item-section avatar><q-icon name="sports_soccer" /></q-item-section>
          <q-item-section>Uredi terene</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="q-pa-md">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth' // prilagodi putanju ako treba

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const drawerOpen = ref(true)

function logout() {
  authStore.logout()   // čisti auth podatke u storeu i localStorage (pretpostavljam)
  $q.notify({
    type: 'positive',
    message: 'Uspješno ste odjavljeni',
    position: 'top'
  })
  router.push('/login')
}

function goTo(page) {
  router.push(`/admin/${page}`)
}
</script>
