<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-md bg-grey-1">
        <div class="text-h5 text-bold text-secondary">Upravljanje administratorima</div>

<<<<<<< HEAD
=======
        <!-- Forma za unos/uređivanje admina -->
>>>>>>> refs/remotes/origin/main
        <q-form @submit.prevent="handleSubmitAdmin" class="q-gutter-md q-mt-md">
          <div class="row q-gutter-md">
            <q-input filled v-model="adminForm.username" label="Korisničko ime" required class="col" />
            <q-input 
              filled 
              v-model="adminForm.password" 
<<<<<<< HEAD
              :label="adminForm.id ? 'Nova lozinka (ostavite prazno za zadržavanje postojeće)' : 'Lozinka'" 
              type="password" 
              :required="!adminForm.id" 
              class="col" 
            />
          </div>
          <div class="row q-gutter-sm">
            <q-btn color="secondary" label="Spremi administratora" type="submit" />
            <q-btn v-if="adminForm.id" color="grey" label="Odustani" flat @click="resetAdminForm" />
=======
              :label="adminForm.id ? 'Nova lozinka (ostavite prazno za zadržavanje postojeće)' : 'Lozinka'"
              type="password" 
              :required="!adminForm.id"
              class="col" 
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn color="secondary" label="Spremi administratora" type="submit" />
            <q-btn
              v-if="adminForm.id"
              color="grey"
              label="Odustani"
              flat
              @click="resetAdminForm"
            />
>>>>>>> refs/remotes/origin/main
          </div>
        </q-form>
      </q-card>

<<<<<<< HEAD
=======
      <!-- Tablica s administratorima -->
>>>>>>> refs/remotes/origin/main
      <q-table
        title="Administratori"
        :rows="administratori"
        :columns="adminColumns"
        row-key="id"
        class="q-mt-lg"
        bordered
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-akcije="props">
          <q-td align="center">
            <q-btn dense icon="edit" color="secondary" @click="editAdmin(props.row)" class="q-mr-sm" />
            <q-btn dense icon="delete" color="red" @click="deleteAdmin(props.row.id)" />
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
const administratori = ref([])

<<<<<<< HEAD
const adminForm = ref({ id: null, username: '', password: '' })
=======
const adminForm = ref({
  id: null,
  username: '',
  password: ''
})

>>>>>>> refs/remotes/origin/main
const adminColumns = [
  { name: 'username', label: 'Korisničko ime', field: 'username', align: 'left', sortable: true },
  { name: 'akcije', label: 'Akcije', field: 'actions', align: 'center' }
]

<<<<<<< HEAD
// Dohvat svih admina
=======
// Dohvat svih administratora
>>>>>>> refs/remotes/origin/main
const fetchAdministratori = async () => {
  try {
    const response = await api.get('/admin')
    administratori.value = response.data
<<<<<<< HEAD
  } catch {
=======
  } catch (err) {
>>>>>>> refs/remotes/origin/main
    $q.notify({ type: 'negative', message: 'Greška pri dohvaćanju administratora' })
  }
}

<<<<<<< HEAD

=======

const handleSubmitAdmin = async () => {
  try {
    const dataToSend = {
      username: adminForm.value.username
    }

    // Dodaj lozinku samo ako je unesena
    if (adminForm.value.password) {
      dataToSend.password = adminForm.value.password
    }

    if (adminForm.value.id) {
      // Update
      await api.put(`/admin/${adminForm.value.id}`, dataToSend)
      $q.notify({ type: 'positive', message: 'Administrator ažuriran' })
    } else {
      // Create - lozinka je obavezna za novog admina
      if (!adminForm.value.password) {
        $q.notify({ type: 'negative', message: 'Lozinka je obavezna za novog administratora' })
        return
      }
      dataToSend.password = adminForm.value.password
>>>>>>> refs/remotes/origin/main
      await api.post('/admin', dataToSend)
      $q.notify({ type: 'positive', message: 'Administrator dodan' })
    }
    await fetchAdministratori()
    resetAdminForm()
<<<<<<< HEAD
  } catch {
=======
  } catch (err) {
>>>>>>> refs/remotes/origin/main
    $q.notify({ type: 'negative', message: 'Greška pri spremanju administratora' })
  }
}

<<<<<<< HEAD
const editAdmin = (admin) => {
  adminForm.value = { id: admin.id, username: admin.username, password: '' }
}

=======
// Popuni formu za edit admina
const editAdmin = (admin) => {
  adminForm.value = {
    id: admin.id,
    username: admin.username,
    password: ''
  }
}

// Brisanje administratora
>>>>>>> refs/remotes/origin/main
const deleteAdmin = async (id) => {
  try {
    await api.delete(`/admin/${id}`)
    $q.notify({ type: 'positive', message: 'Administrator obrisan' })
    await fetchAdministratori()
<<<<<<< HEAD
  } catch {
=======
  } catch (err) {
>>>>>>> refs/remotes/origin/main
    $q.notify({ type: 'negative', message: 'Greška pri brisanju administratora' })
  }
}

<<<<<<< HEAD
const resetAdminForm = () => { adminForm.value = { id: null, username: '', password: '' } }

onMounted(() => { fetchAdministratori() })
</script>

<style scoped>
.q-form { max-width: 600px; }
</style>
=======
// Reset forme za admina
const resetAdminForm = () => {
  adminForm.value = {
    id: null,
    username: '',
    password: ''
  }
}

onMounted(() => {
  fetchAdministratori()
})
</script>

<style scoped>
.q-form {
  max-width: 600px;
}
</style>
>>>>>>> refs/remotes/origin/main
