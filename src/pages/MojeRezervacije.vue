<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-primary">Moje rezervacije</h1>
      <p class="text-h6 text-grey-7">Pregled svih vaših rezervacija</p>
    </div>

    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner-dots size="3rem" color="primary" />
      <div class="text-h6 q-mt-md">Učitavanje rezervacija...</div>
    </div>

    <div v-else-if="rezervacije.length === 0" class="text-center q-mt-xl">
      <q-icon name="event_busy" size="4rem" color="grey-5" />
      <div class="text-h6 q-mt-md text-grey-6">Nemate rezervacija</div>
      <q-btn 
        color="primary" 
        label="Rezerviraj teren" 
        class="q-mt-md"
        @click="$router.push('/field-listings')"
      />
    </div>

    <q-table
      v-else
      :rows="rezervacije"
      :columns="columns"
      row-key="sifra_narudzbe"
      title="Vaše rezervacije"
      class="q-mt-md"
      bordered
      flat
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-datum_iznajmljivanja="props">
        <q-td :props="props">
          <q-chip 
            color="primary" 
            text-color="white" 
            :label="formatDatum(props.value)"
            icon="event"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip 
            color="positive" 
            text-color="white" 
            label="Aktivna"
            icon="check_circle"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn 
            dense 
            flat 
            color="negative" 
            icon="cancel"
            @click="cancelReservation(props.row)"
          >
            <q-tooltip>Otkaži rezervaciju</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Cancel confirmation dialog -->
    <q-dialog v-model="showCancelDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Potvrda otkazivanja</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Jeste li sigurni da želite otkazati rezervaciju za <strong>{{ selectedReservation?.Naziv }}</strong>?</p>
          <p class="text-caption text-grey-6">Ova akcija se ne može poništiti.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Ne" color="primary" @click="showCancelDialog = false" />
          <q-btn label="Da, otkaži" color="negative" @click="confirmCancelReservation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const $q = useQuasar()
const authStore = useAuthStore()
const rezervacije = ref([])
const loading = ref(false)
const showCancelDialog = ref(false)
const selectedReservation = ref(null)

const columns = [
  { 
    name: 'Naziv', 
    label: 'Naziv terena', 
    field: 'Naziv', 
    align: 'left',
    sortable: true
  },
  { 
    name: 'datum_iznajmljivanja', 
    label: 'Datum rezervacije', 
    field: 'datum_iznajmljivanja', 
    align: 'center',
    sortable: true
  },
  { 
    name: 'status', 
    label: 'Status', 
    field: 'status', 
    align: 'center'
  },
  { 
    name: 'actions', 
    label: 'Akcije', 
    field: 'actions', 
    align: 'center'
  }
]

const currentUser = computed(() => authStore.user)

function formatDatum(datum) {
  if (!datum) return 'N/A'
  
  const date = new Date(datum)
  return date.toLocaleDateString('hr-HR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function fetchRezervacije() {
  if (!currentUser.value?.sifra_korisnika) {
    $q.notify({
      type: 'negative',
      message: 'Niste prijavljeni',
      position: 'top'
    })
    return
  }

  loading.value = true
  try {
    // Fetch all reservations and filter by current user
    const response = await api.get('/rezervacije')
    
    // Filter reservations for current user based on ime_korisnika and prezime_korisnika
    rezervacije.value = response.data.filter(rezervacija => 
      rezervacija.ime_korisnika === currentUser.value.ime_korisnika &&
      rezervacija.prezime_korisnika === currentUser.value.prezime_korisnika
    )

    if (rezervacije.value.length === 0) {
      $q.notify({
        type: 'info',
        message: 'Nemate aktivnih rezervacija',
        position: 'top'
      })
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju rezervacija:', error)
    $q.notify({
      type: 'negative',
      message: 'Greška pri dohvaćanju rezervacija',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

function cancelReservation(reservation) {
  selectedReservation.value = reservation
  showCancelDialog.value = true
}

async function confirmCancelReservation() {
  if (!selectedReservation.value) return

  try {
    await api.delete(`/rezervacije/${selectedReservation.value.sifra_narudzbe}`)
    
    // Remove from local array
    rezervacije.value = rezervacije.value.filter(
      r => r.sifra_narudzbe !== selectedReservation.value.sifra_narudzbe
    )

    $q.notify({
      type: 'positive',
      message: 'Rezervacija je uspješno otkazana',
      position: 'top'
    })
  } catch (error) {
    console.error('Greška pri otkazivanju rezervacije:', error)
    $q.notify({
      type: 'negative',
      message: 'Greška pri otkazivanju rezervacije',
      position: 'top'
    })
  } finally {
    showCancelDialog.value = false
    selectedReservation.value = null
  }
}

onMounted(() => {
  fetchRezervacije()
})
</script>

<style scoped>
.q-table {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>