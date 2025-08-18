<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-md bg-grey-1">
        <div class="text-h5 text-bold text-primary">Upravljanje korisnicima</div>

        <!-- Forma za unos/uređivanje korisnika -->
        <q-form @submit.prevent="handleSubmitUser" class="q-gutter-md q-mt-md">
          <div class="row q-gutter-md">
            <q-input filled v-model="userForm.ime_korisnika" label="Ime" required class="col" />
            <q-input filled v-model="userForm.prezime_korisnika" label="Prezime" required class="col" />
          </div>
          
          <div class="row q-gutter-md">
            <q-input filled v-model="userForm.email_korisnika" label="Email" type="email" required class="col" />
            <q-input filled v-model="userForm.broj_telefona_korisnika" label="Broj telefona" class="col" />
          </div>
          
          <div class="row q-gutter-md">
            <q-input filled v-model="userForm.korisnicko_ime" label="Korisničko ime" required class="col" />
            <q-input 
              filled 
              v-model="userForm.lozinka" 
              :label="userForm.id ? 'Nova lozinka (ostavite prazno za zadržavanje postojeće)' : 'Lozinka'"
              type="password" 
              :required="!userForm.id"
              class="col" 
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn color="primary" label="Spremi korisnika" type="submit" />
            <q-btn
              v-if="userForm.id"
              color="grey"
              label="Odustani"
              flat
              @click="resetUserForm"
            />
          </div>
        </q-form>
      </q-card>

      <!-- Tablica s korisnicima -->
      <q-table
        title="Korisnici"
        :rows="korisnici"
        :columns="userColumns"
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

const userForm = ref({
  id: null,
  ime_korisnika: '',
  prezime_korisnika: '',
  email_korisnika: '',
  broj_telefona_korisnika: '',
  korisnicko_ime: '',
  lozinka: ''
})

const userColumns = [
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
    const response = await api.get('/korisnik')
    korisnici.value = response.data
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Greška pri dohvaćanju korisnika' })
  }
}

// Spremi / update korisnika
const handleSubmitUser = async () => {
  try {
    const dataToSend = {
      ime_korisnika: userForm.value.ime_korisnika,
      prezime_korisnika: userForm.value.prezime_korisnika,
      email_korisnika: userForm.value.email_korisnika,
      broj_telefona_korisnika: userForm.value.broj_telefona_korisnika,
      korisnicko_ime: userForm.value.korisnicko_ime
    }

    // Dodaj lozinku samo ako je unesena
    if (userForm.value.lozinka) {
      dataToSend.lozinka = userForm.value.lozinka
    }

    if (userForm.value.id) {
      // Update
      await api.put(`/korisnik/${userForm.value.id}`, dataToSend)
      $q.notify({ type: 'positive', message: 'Korisnik ažuriran' })
    } else {
      // Create - lozinka je obavezna za novi korisnik
      if (!userForm.value.lozinka) {
        $q.notify({ type: 'negative', message: 'Lozinka je obavezna za novog korisnika' })
        return
      }
      dataToSend.lozinka = userForm.value.lozinka
      await api.post('/korisnik', dataToSend)
      $q.notify({ type: 'positive', message: 'Korisnik dodan' })
    }
    await fetchKorisnici()
    resetUserForm()
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Greška pri spremanju korisnika' })
  }
}

// Popuni formu za edit korisnika
const editUser = (korisnik) => {
  userForm.value = {
    id: korisnik.sifra_korisnika,
    ime_korisnika: korisnik.ime_korisnika,
    prezime_korisnika: korisnik.prezime_korisnika,
    email_korisnika: korisnik.email_korisnika,
    broj_telefona_korisnika: korisnik.broj_telefona_korisnika || '',
    korisnicko_ime: korisnik.korisnicko_ime,
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

// Reset forme za korisnika
const resetUserForm = () => {
  userForm.value = {
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