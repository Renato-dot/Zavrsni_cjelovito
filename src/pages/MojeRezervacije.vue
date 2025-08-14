<template>
  <q-page padding>
    <h2>Moje rezervacije</h2>

    <q-table
      :columns="columns"
      :data="rezervacije"
      row-key="Naziv"
      :loading="loading"
      no-data-label="Nema rezervacija za prikaz"
      flat
      bordered
    >
      <template v-slot:body-cell-datum_iznajmljivanja="props">
        {{ formatDatum(props.value) }}
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const rezervacije = ref([]);
const loading = ref(false);

const columns = [
  { name: "Naziv", label: "Naziv terena", field: "Naziv", align: "left" },
  {
    name: "datum_iznajmljivanja",
    label: "Datum iznajmljivanja",
    field: "datum_iznajmljivanja",
    align: "left",
  },
];

function formatDatum(datum) {
  if (!datum) return "";
  return new Date(datum).toLocaleDateString("hr-HR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function loadRezervacije() {
  loading.value = true;
  try {
    const response = await axios.get("/api/rezervacije/korisnik");
    rezervacije.value = response.data;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Greška pri dohvaćanju rezervacija.",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRezervacije();
});
</script>
