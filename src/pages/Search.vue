<template>
  <q-page padding class="flex flex-center">
    <div class="q-pa-xl column items-center" style="max-width: 700px; width: 100%;">
      <!-- Naslov i podnaslov iznad search bara -->
      <div class="text-center q-mb-lg" style="width: 100%;">
        <h1 class="text-h3 text-secondary">Pretraga</h1>
        <p class="text-h6 text-grey-7">Pretražite našu bogatu ponudu i odaberite što Vam najviše odgovara</p>
      </div>

      <!-- Search bar -->
      <q-input
        v-model="searchQuery"
        label="Unesite naziv ili lokaciju terena"
        outlined
        clearable
        @clear="clearSearch"
        class="full-width"
        style="font-size: 1.1rem;"
      />

      <!-- Gumb Traži -->
      <q-btn
        label="Traži"
        color="primary"
        @click="performSearch"
        class="q-my-lg full-width"
        style="font-size: 1.1rem;"
      />

      <!-- Tabela rezultata -->
      <q-table
        v-if="searchQuery && filteredTereni.length"
        :rows="filteredTereni"
        :columns="columns"
        row-key="Sifra_terena"
        title="Rezultati Pretraživanja"
        class="q-mt-xl full-width"
      />

      <!-- Poruka ako nema rezultata -->
      <div
        v-if="searchQuery && filteredTereni.length === 0 && searchPerformed"
        class="q-mt-xl text-negative text-h6 text-center full-width"
      >
        Nema rezultata. Pokušajte s drugim pojmom.
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const searchQuery = ref('')
const tereni = ref([])
const filteredTereni = ref([])
const searchPerformed = ref(false)

const columns = [
  { name: 'Naziv', label: 'Naziv', field: 'Naziv', align: 'left' },
  { name: 'Lokacija', label: 'Lokacija', field: 'Lokacija', align: 'left' },
  { name: 'Radno_vrijeme', label: 'Radno vrijeme', field: 'Radno_vrijeme', align: 'center' },
  { name: 'cijena', label: 'Cijena (€)', field: 'cijena', align: 'center' }
]

async function fetchTereni() {
  try {
    const response = await api.get('/tereni')
    tereni.value = response.data
  } catch (error) {
    console.error('Greška pri dohvaćanju terena:', error)
  }
}

fetchTereni()

function performSearch() {
  searchPerformed.value = true
  const query = searchQuery.value.toLowerCase().trim()

  if (!query) {
    filteredTereni.value = []
    return
  }

  filteredTereni.value = tereni.value.filter(teren => {
    return (
      (teren.Naziv && teren.Naziv.toLowerCase().includes(query)) ||
      (teren.Lokacija && teren.Lokacija.toLowerCase().includes(query))
    )
  })
}

function clearSearch() {
  searchQuery.value = ''
  filteredTereni.value = []
  searchPerformed.value = false
}
</script>
