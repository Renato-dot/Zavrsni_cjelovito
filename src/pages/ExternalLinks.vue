<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-secondary">External Sport Resources</h1>
      <p class="text-h6 text-grey-7">Discover partner facilities and sport-related websites</p>
    </div>

    <div class="row q-gutter-md">
      <q-card 
        v-for="link in externalLinks" 
        :key="link.id"
        class="col-md-3 col-sm-5 col-12 external-card"
        @click="openExternalLink(link.url)"
      >
        <q-card-section class="text-center">
          <q-icon :name="link.icon" size="3rem" :color="link.color" />
          <div class="text-h6 q-mt-md">{{ link.name }}</div>
          <div class="text-body2 text-grey-6 q-mb-md">{{ link.description }}</div>
          <q-chip 
            :color="link.category === 'Facility' ? 'primary' : 'secondary'"
            text-color="white"
            :label="link.category"
          />
        </q-card-section>
        
        <q-card-actions align="center">
          <q-btn 
            flat 
            color="secondary" 
            label="Visit Site"
            icon="launch"
            @click.stop="openExternalLink(link.url)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="showLinkDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">External Link</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>You're about to visit an external website. Continue?</p>
          <p class="text-primary">{{ selectedUrl }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="showLinkDialog = false" />
          <q-btn 
            label="Continue" 
            color="primary"
            @click="confirmExternalLink"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const showLinkDialog = ref(false)
const selectedUrl = ref('')

const externalLinks = ref([
  {
    id: 1,
    name: 'SportCenter Pro',
    description: 'Professional sports facility management',
    url: 'https://www.sportcenter.com',
    icon: 'sports_soccer',
    color: 'primary',
    category: 'Facility'
  },
  {
    id: 2,
    name: 'Athletic Fields Network',
    description: 'Connect with sports fields nationwide',
    url: 'https://www.athleticfields.net',
    icon: 'sports_tennis',
    color: 'secondary',
    category: 'Network'
  },
  {
    id: 3,
    name: 'SwimClub Central',
    description: 'Premier swimming facilities directory',
    url: 'https://www.swimclub.com',
    icon: 'pool',
    color: 'info',
    category: 'Facility'
  },
  {
    id: 4,
    name: 'Basketball Courts USA',
    description: 'Find basketball courts across America',
    url: 'https://www.basketballcourts.usa',
    icon: 'sports_basketball',
    color: 'orange',
    category: 'Directory'
  },
  {
    id: 5,
    name: 'Tennis World',
    description: 'Global tennis court booking platform',
    url: 'https://www.tennisworld.com',
    icon: 'sports_tennis',
    color: 'positive',
    category: 'Platform'
  },
  {
    id: 6,
    name: 'Volleyball Arena',
    description: 'Beach and indoor volleyball facilities',
    url: 'https://www.volleyballarena.com',
    icon: 'sports_volleyball',
    color: 'warning',
    category: 'Facility'
  },
  {
    id: 7,
    name: 'Sports Equipment Rental',
    description: 'Rent sports equipment for your game',
    url: 'https://www.sportsequipment.com',
    icon: 'sports_handball',
    color: 'negative',
    category: 'Service'
  },
  {
    id: 8,
    name: 'Field Maintenance Pro',
    description: 'Professional field maintenance services',
    url: 'https://www.fieldmaintenance.com',
    icon: 'grass',
    color: 'teal',
    category: 'Service'
  }
])

function openExternalLink(url) {
  selectedUrl.value = url
  showLinkDialog.value = true
}

function confirmExternalLink() {
  window.open(selectedUrl.value, '_blank')
  showLinkDialog.value = false
  $q.notify({
    type: 'info',
    message: 'Opening external link...',
    position: 'top'
  })
}
</script>

<style scoped>
.external-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.external-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
</style>