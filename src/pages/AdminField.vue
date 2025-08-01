<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="q-pa-md bg-grey-1">
        <div class="text-h5 text-bold text-primary">Upravljanje terenima</div>

        <!-- Forma za unos/uređivanje -->
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md q-mt-md">
          <q-input filled v-model="form.naziv" label="Naziv" required />
          <q-input filled v-model="form.lokacija" label="Lokacija" required />
          <q-input filled v-model="form.radno_vrijeme" label="Radno vrijeme" required />
          <q-input filled v-model="form.cijena" label="Cijena" />

          <div class="row q-gutter-sm">
            <q-btn color="primary" label="Spremi" type="submit" />
            <q-btn
              v-if="form.id"
              color="grey"
              label="Odustani"
              flat
              @click="resetForm"
            />
          </div>
        </q-form>
      </q-card>

      <!-- Tablica s terenima -->
      <q-table
        title="Tereni"
        :rows="tereni"
        :columns="columns"
        row-key="Sifra_terena"
        class="q-mt-lg"
        bordered
        flat
      >
        <template v-slot:body-cell-akcije="props">
          <q-td align="center">
            <q-btn dense icon="edit" color="primary" @click="editField(props.row)" />
            <q-btn dense icon="delete" color="red" @click="deleteField(props.row.Sifra_terena)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from '../services/api.js'  // provjeri putanju prema api.js

export default {
  setup() {
    const $q = useQuasar()
    const tereni = ref([])
    const form = ref({
      id: null,
      naziv: '',
      lokacija: '',
      radno_vrijeme: '',
      cijena: ''
    })

    // Kolone tablice s velikim početnim slovima polja (to vraća API)
    const columns = [
      { name: 'naziv', label: 'Naziv', field: 'Naziv', align: 'left' },
      { name: 'lokacija', label: 'Lokacija', field: 'Lokacija', align: 'left' },
      { name: 'radno_vrijeme', label: 'Radno vrijeme', field: 'Radno_vrijeme', align: 'left' },
      { name: 'cijena', label: 'Cijena', field: 'cijena', align: 'left' },
      { name: 'akcije', label: 'Akcije', field: 'actions', align: 'center' }
    ]

    // Dohvat svih terena
    const fetchTereni = async () => {
      try {
        const response = await api.get('/tereni')
        tereni.value = response.data
      } catch (err) {
        $q.notify({ type: 'negative', message: 'Greška pri dohvaćanju terena' })
      }
    }

    // Spremi / update teren
    const handleSubmit = async () => {
      try {
        const dataToSend = {
          Naziv: form.value.naziv,
          Lokacija: form.value.lokacija,
          Radno_vrijeme: form.value.radno_vrijeme,
          cijena: form.value.cijena
        }

        if (form.value.id) {
          // Update
          await api.put(`/tereni/${form.value.id}`, dataToSend)
          $q.notify({ type: 'positive', message: 'Teren ažuriran' })
        } else {
          // Create
          await api.post('/tereni', dataToSend)
          $q.notify({ type: 'positive', message: 'Teren dodan' })
        }
        await fetchTereni()
        resetForm()
      } catch (err) {
        $q.notify({ type: 'negative', message: 'Greška pri spremanju' })
      }
    }

    // Popuni formu za edit
    const editField = (teren) => {
      form.value = {
        id: teren.Sifra_terena,
        naziv: teren.Naziv,
        lokacija: teren.Lokacija,
        radno_vrijeme: teren.Radno_vrijeme,
        cijena: teren.cijena || ''
      }
    }

    // Brisanje terena
    const deleteField = async (id) => {
      try {
        await api.delete(`/tereni/${id}`)
        $q.notify({ type: 'positive', message: 'Teren obrisan' })
        await fetchTereni()
      } catch (err) {
        $q.notify({ type: 'negative', message: 'Greška pri brisanju' })
      }
    }

    // Reset forme
    const resetForm = () => {
      form.value = {
        id: null,
        naziv: '',
        lokacija: '',
        radno_vrijeme: '',
        cijena: ''
      }
    }

    onMounted(() => {
      fetchTereni()
    })

    return {
      form,
      tereni,
      columns,
      handleSubmit,
      resetForm,
      editField,
      deleteField
    }
  }
}
</script>

<style scoped>
.q-form {
  max-width: 600px;
}
</style>
