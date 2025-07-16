<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-primary">Settings</h1>
      <p class="text-h6 text-grey-7">Customize your SportFields experience</p>
    </div>

    <div class="row justify-center">
      <div class="col-md-6 col-sm-8 col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="settings" class="q-mr-sm" />
              Preferences
            </div>
            
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Dark Mode</q-item-label>
                  <q-item-label caption>Toggle between light and dark theme</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    v-model="isDarkMode"
                    @update:model-value="toggleDarkMode"
                    color="primary"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="info" class="q-mr-sm" />
              About
            </div>
            
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>App Version</q-item-label>
                  <q-item-label caption>1.0.0</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label>Theme</q-item-label>
                  <q-item-label caption>{{ isDarkMode ? 'Dark' : 'Light' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isDarkMode = ref(false)

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'true'
    $q.dark.set(isDarkMode.value)
  }
})

function toggleDarkMode(value) {
  $q.dark.set(value)
  localStorage.setItem('darkMode', value.toString())
  
  $q.notify({
    type: 'info',
    message: `${value ? 'Dark' : 'Light'} mode enabled`,
    position: 'top'
  })
}
</script>