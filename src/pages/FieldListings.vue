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

// Transformacija podataka iz baze
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

// Slike po vrsti naziva
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

// Dohvat podataka
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

// Poziv rezervacije (koristi session korisnika)
function bookField(field) {
  const korisnik = JSON.parse(localStorage.getItem('korisnik'))
  const datum = new Date().toISOString().split('T')[0]

  if (!korisnik || !korisnik.ime_korisnika || !korisnik.prezime_korisnika) {
    $q.notify({
      type: 'negative',
      message: 'Niste prijavljeni ili nedostaju podaci korisnika',
      position: 'top'
    })
    return
  }

  const payload = {
    Naziv: field.name,
    datum_iznajmljivanja: datum
  }

  console.log('Šaljem payload:', payload)
  console.log('Session korisnik should be available on backend')

  api.post('/rezervacije', payload, { withCredentials: true })
    .then(() => {
      $q.notify({
        type: 'positive',
        message: `Rezervacija za ${field.name} uspješna!`,
        position: 'top'
      })
      showDetails.value = false
    })
    .catch(err => {
      console.error('Rezervacija greška:', err)
      console.error('Error response:', err.response?.data)
      $q.notify({
        type: 'negative',
        message: err.response?.data?.error || 'Greška pri rezervaciji.',
        position: 'top'
      })
    })
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
