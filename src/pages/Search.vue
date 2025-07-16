<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-primary">Search</h1>
      <p class="text-h6 text-grey-7">Find sport fields and external resources</p>
    </div>

    <div class="row justify-center q-mb-lg">
      <div class="col-md-8 col-12">
        <q-input
          v-model="searchQuery"
          label="Search fields and resources..."
          filled
          clearable
          @input="performSearch"
          icon="search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div v-if="searchQuery && searchResults.length === 0" class="text-center text-grey-6">
      <q-icon name="search_off" size="3rem" />
      <div class="text-h6 q-mt-md">No results found</div>
      <div class="text-body2">Try different keywords</div>
    </div>

    <div v-if="searchResults.length > 0">
      <div class="text-h6 q-mb-md">Search Results ({{ searchResults.length }})</div>
      
      <div class="row q-gutter-md">
        <q-card 
          v-for="result in searchResults" 
          :key="result.id"
          class="col-md-5 col-12 result-card"
          @click="handleResultClick(result)"
        >
          <q-card-section>
            <div class="row items-center">
              <q-icon 
                :name="result.type === 'field' ? 'sports_soccer' : 'link'" 
                :color="result.type === 'field' ? 'primary' : 'secondary'"
                size="2rem"
                class="q-mr-md"
              />
              <div>
                <div class="text-h6">{{ result.name }}</div>
                <div class="text-caption text-grey-6">{{ result.description }}</div>
              </div>
            </div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <q-chip 
              :color="result.type === 'field' ? 'primary' : 'secondary'"
              text-color="white"
              :label="result.type === 'field' ? 'Sport Field' : 'External Link'"
            />
            <span v-if="result.type === 'field' && result.price" class="text-subtitle1 text-primary q-ml-md">
              ${{ result.price }}/hr
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const allData = ref([])

// Mock data combining fields and external links
const mockData = [
  // Sport fields
  {
    id: 'field-1',
    name: 'Green Valley Soccer Field',
    description: 'Professional grass field with floodlights',
    type: 'field',
    price: 45,
    sport: 'Soccer',
    available: true
  },
  {
    id: 'field-2',
    name: 'City Basketball Court',
    description: 'Indoor court with professional flooring',
    type: 'field',
    price: 35,
    sport: 'Basketball',
    available: true
  },
  {
    id: 'field-3',
    name: 'Tennis Center Court A',
    description: 'Clay court with professional net',
    type: 'field',
    price: 25,
    sport: 'Tennis',
    available: false
  },
  {
    id: 'field-4',
    name: 'Olympic Swimming Pool',
    description: '50m Olympic-sized pool',
    type: 'field',
    price: 60,
    sport: 'Swimming',
    available: true
  },
  {
    id: 'field-5',
    name: 'Badminton Hall',
    description: 'Multi-court badminton facility',
    type: 'field',
    price: 20,
    sport: 'Badminton',
    available: true
  },
  {
    id: 'field-6',
    name: 'Volleyball Beach Court',
    description: 'Sand volleyball court by the beach',
    type: 'field',
    price: 30,
    sport: 'Volleyball',
    available: true
  },
  // External links
  {
    id: 'link-1',
    name: 'SportCenter Pro',
    description: 'Professional sports facility management',
    type: 'external',
    url: 'https://www.sportcenter.com'
  },
  {
    id: 'link-2',
    name: 'Athletic Fields Network',
    description: 'Connect with sports fields nationwide',
    type: 'external',
    url: 'https://www.athleticfields.net'
  },
  {
    id: 'link-3',
    name: 'SwimClub Central',
    description: 'Premier swimming facilities directory',
    type: 'external',
    url: 'https://www.swimclub.com'
  },
  {
    id: 'link-4',
    name: 'Basketball Courts USA',
    description: 'Find basketball courts across America',
    type: 'external',
    url: 'https://www.basketballcourts.usa'
  },
  {
    id: 'link-5',
    name: 'Tennis World',
    description: 'Global tennis court booking platform',
    type: 'external',
    url: 'https://www.tennisworld.com'
  },
  {
    id: 'link-6',
    name: 'Volleyball Arena',
    description: 'Beach and indoor volleyball facilities',
    type: 'external',
    url: 'https://www.volleyballarena.com'
  }
]

onMounted(() => {
  allData.value = mockData
})

function performSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = allData.value.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    (item.sport && item.sport.toLowerCase().includes(query))
  )
}

function handleResultClick(result) {
  if (result.type === 'field') {
    router.push('/field-listings')
    $q.notify({
      type: 'info',
      message: `Navigating to ${result.name}`,
      position: 'top'
    })
  } else {
    window.open(result.url, '_blank')
    $q.notify({
      type: 'info',
      message: `Opening ${result.name}`,
      position: 'top'
    })
  }
}
</script>

<style scoped>
.result-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
</style>