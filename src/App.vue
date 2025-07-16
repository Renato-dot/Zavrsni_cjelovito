<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="authStore.isAuthenticated">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <q-icon name="sports_soccer" size="sm" class="q-mr-sm" />
          SportFields Rental
        </q-toolbar-title>
        <div class="q-mr-md">
          Welcome, {{ authStore.user?.korisnicko_ime }}
        </div>
        <q-btn flat round dense icon="search" @click="$router.push('/search')" />
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      v-if="authStore.isAuthenticated"
      bordered
      :width="200"
      :breakpoint="400"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header>Navigation</q-item-label>
          
          <q-item clickable @click="$router.push('/')" v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/field-listings')" v-ripple>
            <q-item-section avatar>
              <q-icon name="sports_soccer" />
            </q-item-section>
            <q-item-section>Field Listings</q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/external-links')" v-ripple>
            <q-item-section avatar>
              <q-icon name="link" />
            </q-item-section>
            <q-item-section>External Links</q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/search')" v-ripple>
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>Search</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable @click="$router.push('/settings')" v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item clickable @click="handleLogout" v-ripple>
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  authStore.logout()
  $q.notify({
    type: 'info',
    message: 'Logged out successfully',
    position: 'top'
  })
  router.push('/login')
}
</script>