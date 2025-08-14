<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-md bg-grey-1">
        <div class="text-h5 text-bold text-primary">Upravljanje korisnicima</div>

        <!-- Forma za unos/uređivanje korisnika -->
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md q-mt-md">
          <div class="row q-gutter-md">
            <q-input filled v-model="adminForm.ime_korisnika" label="Ime" required class="col" />
            <q-input filled v-model="adminForm.prezime_korisnika" label="Prezime" required class="col" />
          </div>
          
          <div class="row q-gutter-md">
            <q-input filled v-model="adminForm.email_korisnika" label="Email" type="email" required class="col" />
            <q-input filled v-model="adminForm.broj_telefona_korisnika" label="Broj telefona" class="col" />
          </div>
          
          <div class="row q-gutter-md">
            <q-input filled v-model="adminForm.korisnicko_ime" label="Korisničko ime" required class="col" />
            <q-input 
              filled 
              v-model="adminForm.lozinka" 
              :label="adminForm.id ? 'Nova lozinka (ostavite prazno za zadržavanje postojeće)' : 'Lozinka'"
              type="password" 
              :required="!adminForm.id"
              class="col" 
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn color="primary" label="Spremi korisnika" type="submit" />
            <q-btn
              v-if="adminForm.id"
              color="grey"
              label="Odustani"
              flat
              @click="resetForm"
            />
          </div>
        </q-form>
      </q-card>

      <!-- Tablica s korisnicima -->
      <q-table
        title="Korisnici"
        :rows="korisnici"
        :columns="columns"
        row-key="sifra_korisnika"
        class="q-mt-lg"
        bordered
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-akcije="props">
          <q-td align="center">
            <q-btn dense icon="edit" color="primary" @click="editUser(props.row)" class="q-mr-sm" />
            <q-btn dense icon="delete" color="red" @click="deleteUser(props.row.sifra_korisnika)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from '../services/api.js'

const $q = useQuasar()
const korisnici = ref([])

const adminForm = ref({
  id: null,
  ime_korisnika: '',
  prezime_korisnika: '',
  email_korisnika: '',
  broj_telefona_korisnika: '',
  korisnicko_ime: '',
  lozinka: ''
})

const columns = [
  { name: 'ime_korisnika', label: 'Ime', field: 'ime_korisnika', align: 'left', sortable: true },
  { name: 'prezime_korisnika', label: 'Prezime', field: 'prezime_korisnika', align: 'left', sortable: true },
  { name: 'email_korisnika', label: 'Email', field: 'email_korisnika', align: 'left', sortable: true },
  { name: 'korisnicko_ime', label: 'Korisničko ime', field: 'korisnicko_ime', align: 'left', sortable: true },
  { name: 'broj_telefona_korisnika', label: 'Telefon', field: 'broj_telefona_korisnika', align: 'left' },
  { name: 'akcije', label: 'Akcije', field: 'actions', align: 'center' }
]

// Dohvat svih korisnika
const fetchKorisnici = async () => {
  try {
    const res = await api.get('/korisnik')
    korisnici.value = res.data
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Greška pri dohvaćanju korisnika' })
  }
}

// Spremi / update korisnika
const handleSubmit = async () => {
  try {
    const data = {
      ime_korisnika: adminForm.value.ime_korisnika,
      prezime_korisnika: adminForm.value.prezime_korisnika,
      email_korisnika: adminForm.value.email_korisnika,
      broj_telefona_korisnika: adminForm.value.broj_telefona_korisnika,
      korisnicko_ime: adminForm.value.korisnicko_ime
    }

    if (adminForm.value.lozinka) data.lozinka = adminForm.value.lozinka

    if (adminForm.value.id) {
      await api.put(`/korisnik/${adminForm.value.id}`, data)
      $q.notify({ type: 'positive', message: 'Korisnik ažuriran' })
    } else {
      if (!adminForm.value.lozinka) {
        $q.notify({ type: 'negative', message: 'Lozinka je obavezna za novog korisnika' })
        return
      }
      await api.post('/korisnik', data)
      $q.notify({ type: 'positive', message: 'Korisnik dodan' })
    }

    await fetchKorisnici()
    resetForm()
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Greška pri spremanju korisnika' })
  }
}

// Edit korisnika
const editUser = (u) => {
  adminForm.value = {
    id: u.sifra_korisnika,
    ime_korisnika: u.ime_korisnika,
    prezime_korisnika: u.prezime_korisnika,
    email_korisnika: u.email_korisnika,
    broj_telefona_korisnika: u.broj_telefona_korisnika || '',
    korisnicko_ime: u.korisnicko_ime,
    lozinka: ''
  }
}

// Brisanje korisnika
const deleteUser = async (id) => {
  try {
    await api.delete(`/korisnik/${id}`)
    $q.notify({ type: 'positive', message: 'Korisnik obrisan' })
    await fetchKorisnici()
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Greška pri brisanju korisnika' })
  }
}

// Reset forme
const resetForm = () => {
  adminForm.value = {
    id: null,
    ime_korisnika: '',
    prezime_korisnika: '',
    email_korisnika: '',
    broj_telefona_korisnika: '',
    korisnicko_ime: '',
    lozinka: ''
  }
}

onMounted(() => {
  fetchKorisnici()
})
</script>

<style scoped>
.q-form {
  max-width: 800px;
}
</style>
