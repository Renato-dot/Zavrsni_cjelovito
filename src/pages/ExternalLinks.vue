<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-secondary">Linkovi naših partnera</h1>
      <p class="text-h6 text-grey-7">Istražite stranice naših partnera i nađite ponudu baš za sebe</p>
    </div>

    <div class="row q-gutter-md">
      <q-card 
        v-for="link in externalLinks" 
        :key="link.id"
        class="col-md-3 col-sm-5 col-12 external-card"
        @click="openExternalLink(link.url)"
      >
        <q-card-section class="text-center">
          <q-icon :name="link.icon" size="3rem" :color="link.color" />
          <div class="text-h6 q-mt-md">{{ link.name }}</div>
          <div class="text-body2 text-grey-6 q-mb-md">{{ link.description }}</div>
          <q-chip 
            :color="link.category === 'Facility' ? 'primary' : 'secondary'"
            text-color="white"
            :label="link.category"
          />
        </q-card-section>
        
        <q-card-actions align="center">
          <q-btn 
            flat 
            color="secondary" 
            label="Posjetite stranicu"
            icon="launch"
            @click.stop="openExternalLink(link.url)"
          />
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="showLinkDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Vanjski linkovi</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Napuštate stranicu. Želite li nastaviti?</p>
          <p class="text-primary">{{ selectedUrl }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="showLinkDialog = false" />
          <q-btn 
            label="Continue" 
            color="primary"
            @click="confirmExternalLink"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const showLinkDialog = ref(false)
const selectedUrl = ref('')

const externalLinks = ref([
  {
    id: 1,
    name: 'SportCenter Pro',
    description: 'Profesionalna ustanova za održavanje terena',
    url: 'https://mifkasport.hr/odrzavanje-i-servisi-prirodnih-i-umjetnih-travnjaka/',
    icon: 'sports_soccer',
    color: 'primary',
    category: 'Ustanova'
  },
  {
    id: 2,
    name: 'Tereni za trčanje',
    description: 'Tereni za trčanje diljem države',
    url: 'https://rezervacije.rijekasport.hr/rezervacija/?sport=tr%C4%8Danje',
    icon: 'sports_tennis',
    color: 'secondary',
    category: 'Network'
  },
  {
    id: 3,
    name: 'Plivački klub',
    description: 'Najbolji plivački tereni',
    url: 'https://www.rijekasport.hr/hr/objekti/bazeni-kantrida/termini-za-gradjanstvo/',
    icon: 'pool',
    color: 'info',
    category: 'Ustanova'
  },
  {
    id: 4,
    name: 'Košarkaški tereni',
    description: 'Najbolji košarkški tereni u lijepoj našoj',
    url: 'https://rezervacije.rijekasport.hr/rezervacija/?sport=kosarka',
    icon: 'sports_basketball',
    color: 'orange',
    category: 'Multifunkcionalno'
  },
  {
    id: 5,
    name: 'Svijet tenisa',
    description: 'Široki izbor teniskih terena',
    url: 'https://rezervacije.rijekasport.hr/rezervacija/?sport=tenis',
    icon: 'sports_tennis',
    color: 'positive',
    category: 'Platforma'
  },
  {
    id: 6,
    name: 'Odbojka',
    description: 'Odbojka na plaži ili u dvorani? Mi imamo sve',
    url: 'https://www.kop-vrapce.com/rezerviraj-teren-2/',
    icon: 'sports_volleyball',
    color: 'warning',
    category: 'Ustanova'
  },
  {
    id: 7,
    name: 'Iznajmljivanje opreme',
    description: 'Iznajmite potrebnu opremu',
    url: 'https://usluge.hervis.hr/trgovina/sup-daske',
    icon: 'sports_handball',
    color: 'negative',
    category: 'Usluga'
  }
])

function openExternalLink(url) {
  selectedUrl.value = url
  showLinkDialog.value = true
}

function confirmExternalLink() {
  window.open(selectedUrl.value, '_blank')
  showLinkDialog.value = false
  $q.notify({
    type: 'info',
    message: 'Otvaranje linka...',
    position: 'top'
  })
}
</script>

<style scoped>
.external-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.external-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
</style>