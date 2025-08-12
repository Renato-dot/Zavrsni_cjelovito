<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header i drawer se prikazuju samo ako nismo na admin ruti i korisnik je autentificiran -->
    <q-header elevated v-if="authStore.isAuthenticated && !isAdminRoute">
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
          Sporty - tereni
        </q-toolbar-title>
        <div class="q-mr-md">
          Dobrodošli, {{ authStore.user?.korisnicko_ime }}
        </div>
        <q-btn flat round dense icon="search" @click="$router.push('/search')" />
        <q-btn flat round dense icon="logout" @click="handleLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      v-if="authStore.isAuthenticated && !isAdminRoute"
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
            <q-item-section>Naši tereni</q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/external-links')" v-ripple>
            <q-item-section avatar>
              <q-icon name="link" />
            </q-item-section>
            <q-item-section>Partnerski linkovi</q-item-section>
          </q-item>

          <q-item clickable @click="$router.push('/search')" v-ripple>
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>Pretraga</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable @click="$router.push('/settings')" v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Postavke</q-item-section>
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

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
