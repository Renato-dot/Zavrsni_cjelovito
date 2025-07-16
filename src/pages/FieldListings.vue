<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-primary">Available Sport Fields</h1>
      <p class="text-h6 text-grey-7">Choose from our selection of premium sport facilities</p>
    </div>

    <div class="row q-gutter-md">
      <div v-if="loading" class="col-12 text-center">
        <q-spinner-dots size="3rem" color="primary" />
        <div class="text-h6 q-mt-md">Loading sport fields...</div>
      </div>
      
      <q-card 
        v-else
        v-for="field in fields" 
        :key="field.id" 
        class="col-md-3 col-sm-5 col-12 field-card"
      >
        <q-img
          :src="field.image"
          height="200px"
          class="field-image"
        />
        <q-card-section>
          <div class="text-h6 text-primary">{{ field.name }}</div>
          <div class="text-caption text-grey-6 q-mb-sm">{{ field.location }}</div>
          <div class="text-body2">{{ field.description }}</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <div class="row items-center">
            <div class="col">
              <q-chip 
                :color="field.available ? 'positive' : 'negative'"
                text-color="white"
                :label="field.available ? 'Available' : 'Booked'"
              />
            </div>
            <div class="col-auto">
              <span class="text-h6 text-primary">${{ field.price }}/hr</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            color="primary" 
            label="View Details"
            @click="viewDetails(field)"
          />
          <q-btn 
            color="primary" 
            label="Book Now"
            :disable="!field.available"
            @click="bookField(field)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="showDetails" persistent>
      <q-card style="min-width: 400px" v-if="selectedField">
        <q-card-section>
          <div class="text-h6">{{ selectedField.name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p><strong>Location:</strong> {{ selectedField.location }}</p>
          <p><strong>Sport Type:</strong> {{ selectedField.sport }}</p>
          <p><strong>Capacity:</strong> {{ selectedField.capacity }} players</p>
          <p><strong>Features:</strong> {{ selectedField.features }}</p>
          <p><strong>Price:</strong> ${{ selectedField.price }} per hour</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="showDetails = false" />
          <q-btn 
            label="Book Now" 
            color="primary"
            :disable="!selectedField.available"
            @click="bookField(selectedField)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import api from '../services/api'

const $q = useQuasar()
const tereni = ref([])
const loading = ref(false)
const showDetails = ref(false)
const selectedField = ref(null)

// Transform tereni data to match the UI format
const fields = computed(() => {
  return tereni.value.map(teren => ({
    id: teren.Sifra_terena,
    name: teren.Naziv_terena || 'Sport Field',
    location: teren.Lokacija || 'Unknown Location',
    sport: teren.Tip_sporta || 'General',
    description: teren.Opis || 'Sport field available for booking',
    price: teren.Cijena_po_satu || 0,
    available: teren.Dostupnost !== false,
    capacity: teren.Kapacitet || 0,
    features: teren.Karakteristike || 'Standard features',
    image: teren.Slika || getDefaultImage(teren.Tip_sporta)
  }))
})

// Get default image based on sport type
function getDefaultImage(sportType) {
  const imageMap = {
    'Soccer': 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Basketball': 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Tennis': 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Swimming': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Volleyball': 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
  return imageMap[sportType] || 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400'
}

// Fetch tereni from API
async function fetchTereni() {
  loading.value = true
  try {
    const response = await api.get('/tereni')
    tereni.value = response.data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load sport fields',
      position: 'top'
    })
    console.error('Error fetching tereni:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTereni()
})

function viewDetails(field) {
  selectedField.value = field
  showDetails.value = true
}

function bookField(field) {
  $q.notify({
    type: 'positive',
    message: `Booking request sent for ${field.name}!`,
    position: 'top'
  })
  showDetails.value = false
}
</script>

<style scoped>
.field-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.field-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.field-image {
  border-radius: 8px 8px 0 0;
}
</style>