<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-primary">Dostupni tereni</h1>
      <p class="text-h6 text-grey-7">Odaberite jedan od naših sportskih terena</p>
    </div>

    <div class="row q-gutter-md">
      <div v-if="loading" class="col-12 text-center">
        <q-spinner-dots size="3rem" color="primary" />
        <div class="text-h6 q-mt-md">Učitavanje terena...</div>
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
          <div class="text-body2">Radno vrijeme: {{ field.workingHours }}</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <div class="row items-center">
            <div class="col">
              <q-chip 
                color="positive"
                text-color="white"
                label="Dostupan"
              />
            </div>
            <div class="col-auto">
              <span class="text-h6 text-primary">{{ field.price }}€ / h</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            color="primary" 
            label="Detalji"
            @click="viewDetails(field)"
          />
          <q-btn 
            color="primary" 
            label="Rezerviraj"
            @click="bookField(field)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- MODAL -->
    <q-dialog v-model="showDetails" persistent>
      <q-card style="min-width: 400px" v-if="selectedField">
        <q-card-section>
          <div class="text-h6">{{ selectedField.name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p><strong>Lokacija:</strong> {{ selectedField.location }}</p>
          <p><strong>Radno vrijeme:</strong> {{ selectedField.workingHours }}</p>
          <p><strong>Cijena:</strong> {{ selectedField.price }} € / sat</p>
          <p><strong>Oprema:</strong> {{ selectedField.features }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Zatvori" color="primary" @click="showDetails = false" />
          <q-btn 
            label="Rezerviraj" 
            color="primary"
            @click="bookField(selectedField)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- TIME SLOT BOOKING MODAL -->
    <q-dialog v-model="showTimeSlots" persistent>
      <q-card style="min-width: 500px" v-if="selectedField">
        <q-card-section>
          <div class="text-h6">Rezervacija - {{ selectedField.name }}</div>
          <div class="text-subtitle2 text-grey-6">{{ selectedField.location }}</div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <q-input
              v-model="selectedDate"
              type="date"
              label="Odaberite datum"
              filled
              @update:model-value="fetchTimeSlots"
            />
          </div>

          <div v-if="selectedDate" class="q-mb-md">
            <div class="text-subtitle1 q-mb-sm">Dostupni termini:</div>
            <div class="row q-gutter-sm">
              <q-btn
                v-for="slot in timeSlots"
                :key="slot.sat"
                :color="slot.rezerviran ? 'negative' : 'positive'"
                :disable="slot.rezerviran"
                :label="`${slot.sat}:00`"
                @click="selectTimeSlot(slot)"
                class="time-slot-btn"
              />
            </div>
            <div class="q-mt-sm text-caption text-grey-6">
              <q-icon name="circle" color="positive" size="xs" /> Dostupno
              <q-icon name="circle" color="negative" size="xs" class="q-ml-md" /> Rezervirano
            </div>
          </div>

          <div v-if="selectedTimeSlot" class="q-pa-md bg-grey-2 rounded-borders">
            <div class="text-subtitle2">Odabrani termin:</div>
            <div class="text-body1">
              <strong>{{ selectedDate }}</strong> u <strong>{{ selectedTimeSlot.sat }}:00</strong>
            </div>
            <div class="text-body2 text-grey-6">
              Cijena: {{ selectedField.price }}€ / sat
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" color="grey" @click="closeTimeSlotModal" />
          <q-btn 
            label="Potvrdi rezervaciju" 
            color="primary"
            :disable="!selectedTimeSlot"
            @click="confirmReservation"
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
const showTimeSlots = ref(false)
const selectedDate = ref('')
const selectedTimeSlot = ref(null)
const timeSlots = ref([])

const fields = computed(() => {
  return tereni.value.map(teren => ({
    id: teren.Sifra_terena,
    name: teren.Naziv || 'Nepoznat teren',
    location: teren.Lokacija || 'Nepoznata lokacija',
    workingHours: teren.Radno_vrijeme || 'N/A',
    price: teren.cijena || 0,
    available: true,
    features: 'Standardna oprema',
    image: getDefaultImage(teren.Naziv)
  }))
})

function getDefaultImage(name) {
  if (!name) return fallback
  const map = {
    'Nogometni teren': 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Teren za košarku': 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Tenis': 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Plivanje': 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
  return map[name] || fallback
}

const fallback = 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400'

async function fetchTereni() {
  loading.value = true
  try {
    const response = await api.get('/tereni')
    tereni.value = response.data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Greška pri dohvaćanju terena',
      position: 'top'
    })
    console.error('Greška:', error)
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
  selectedField.value = field
  showDetails.value = false
  showTimeSlots.value = true
  
  const today = new Date()
  selectedDate.value = today.toISOString().split('T')[0]
  
  fetchTimeSlots()
}

async function fetchTimeSlots() {
  if (!selectedDate.value || !selectedField.value) return
  
  try {
    const response = await api.get('/termini', {
      params: {
        teren_id: selectedField.value.id,
        datum: selectedDate.value
      }
    })
    
    timeSlots.value = response.data.map(slot => ({
      sat: slot.sat,
      rezerviran: slot.rezerviran === 1 || slot.rezerviran === true
    })).sort((a, b) => a.sat - b.sat)
    
  } catch (error) {
    timeSlots.value = []
    for (let sat = 8; sat <= 20; sat++) {
      timeSlots.value.push({
        sat: sat,
        rezerviran: false
      })
    }
    console.log('Creating default time slots:', error)
  }
}

function selectTimeSlot(slot) {
  if (!slot.rezerviran) {
    selectedTimeSlot.value = slot
  }
}

function closeTimeSlotModal() {
  showTimeSlots.value = false
  selectedDate.value = ''
  selectedTimeSlot.value = null
  timeSlots.value = []
}

async function confirmReservation() {
  if (!selectedTimeSlot.value || !selectedDate.value || !selectedField.value) {
    $q.notify({
      type: 'negative',
      message: 'Molimo odaberite datum i termin',
      position: 'top'
    })
    return
  }

  const korisnik = JSON.parse(localStorage.getItem('user'))

  if (!korisnik || !korisnik.ime_korisnika || !korisnik.prezime_korisnika) {
    $q.notify({
      type: 'negative',
      message: 'Niste prijavljeni ili nedostaju podaci korisnika',
      position: 'top'
    })
    return
  }

  const payload = {
    Naziv: selectedField.value.name,
    datum_iznajmljivanja: selectedDate.value,
    sat: selectedTimeSlot.value.sat,
    teren_id: selectedField.value.id
  }

  try {
    await api.post('/rezervacije', payload, { withCredentials: true })
    
    $q.notify({
      type: 'positive',
      message: `Rezervacija za ${selectedField.value.name} na ${selectedDate.value} u ${selectedTimeSlot.value.sat}:00 uspješna!`,
      position: 'top'
    })
    
    closeTimeSlotModal()
  } catch (err) {
    console.error('Rezervacija greška:', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.error || 'Greška pri rezervaciji.',
      position: 'top'
    })
  }
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
